import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    LinearProgress,
    Stack,
    Typography,
    alpha,
    useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { League, Player, PositionDepth, Team, TeamStats } from "src/@types/types";
import { MetadataContext } from "src/contexts/MetadataContext";
import { numStarters } from "./Home";
import gameplay from "src/utils/gameplay";
import { useSnackbar } from "notistack";
import GraphAllSections from "src/components/GraphAllSections";
import { TeamInfoStack } from "../components/TeamInfoStack";
import { MomentumLine } from "../components/MomentumLine";
import { TeamCard } from "../components/TeamCard";
import { PlayerCard } from "src/components/PlayerCard";

// ----------------------------------------------------------------------

const GAME_MINUTES = 90;
const MINUTE_INCREMENT = 5;
const INCREMENT_MULTIPLIER = 100;

// ----------------------------------------------------------------------

export default function PlayGame() {

    const { allLeagues } = useContext(MetadataContext);
    const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
    const [selectedHomeTeam, setSelectedHomeTeam] = useState<Team | null>(null);
    const [selectedAwayTeam, setSelectedAwayTeam] = useState<Team | null>(null);
    const [gamePlaying, setGamePlaying] = useState<boolean>(false);

    return (
        <Container maxWidth={false}>
            { !gamePlaying &&
                <Stack spacing={2} alignItems={'center'} sx={{ width: '100%' }}>
                    <Stack spacing={2} alignItems={'center'} sx={{ width: '100%' }}>
                        <Typography variant={'h6'}>Selected League: {selectedLeague ? selectedLeague.name : '-'}</Typography>
                        { !selectedLeague &&
                            <Stack spacing={2} alignItems={'center'} justifyContent={'center'}>
                                {allLeagues.map((league: League) => {   
                                    return (
                                        <Button variant={'contained'} key={league.id} onClick={() => { setSelectedLeague(league) }}>
                                            {league.name}
                                        </Button>
                                    )
                                }
                                )}
                            </Stack>
                        }
                    </Stack>
                    { selectedLeague && (
                        <>
                            <Stack spacing={2} alignItems={'flex-start'} justifyContent={'center'} direction={'row'}>
                                <Stack spacing={2} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant={'h6'}>Home Team: {selectedHomeTeam ? selectedHomeTeam.name : '-'}</Typography>
                                    { !selectedHomeTeam &&
                                        <Stack spacing={2} alignItems={'center'} justifyContent={'center'}>
                                            {selectedLeague.teams.filter((team: Team) => checkIfAllStartersFilled(team)).map((team: Team, index: number) => (
                                                <TeamCard key={team.name + 'home' + index} team={team} setTeam={setSelectedHomeTeam} />
                                            ))}
                                        </Stack>
                                    }
                                </Stack>
                                <Divider orientation={'vertical'} flexItem />
                                <Stack spacing={2} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant={'h6'}>Away Team: {selectedAwayTeam ? selectedAwayTeam.name : '-'}</Typography>
                                    { (selectedHomeTeam && !selectedAwayTeam) &&
                                        <Stack spacing={2} alignItems={'center'} justifyContent={'center'}>
                                            {selectedLeague.teams.filter((team: Team) => checkIfAllStartersFilled(team) && team.id !== selectedHomeTeam.id)
                                                .map((team: Team, index: number) => (
                                                    <TeamCard key={team.name + 'away' + index} team={team} setTeam={setSelectedAwayTeam} />
                                                ))
                                            }
                                        </Stack>
                                    }
                                </Stack>
                            </Stack>
                            { selectedHomeTeam && selectedAwayTeam &&
                                <Button variant={'contained'} onClick={() => { setGamePlaying(true) }}>
                                    Play Game
                                </Button>
                            }
                        </>
                    )}
                </Stack>
            }

            { (gamePlaying && selectedHomeTeam && selectedAwayTeam) &&
                <GamePlay homeTeam={selectedHomeTeam} awayTeam={selectedAwayTeam} />
            }

            { (!gamePlaying && selectedHomeTeam && selectedAwayTeam) &&
                <Stack sx={{ width: '100%', mt: 4 }} direction={'row'}  justifyContent={'center'} alignItems={'flex-end'} spacing={2}>
                    <Grid container spacing={2} alignItems={'center'} justifyContent={'center'} sx={{ width: '100%' }}>
                        { selectedHomeTeam.keepers.starters.map((player: Player) => RenderPlayerCards({ player, position: 'Keeper', depth: selectedHomeTeam.keepers })) }
                        { selectedHomeTeam.chasers.starters.map((player: Player) => RenderPlayerCards({ player, position: 'Chaser', depth: selectedHomeTeam.chasers })) }
                        { selectedHomeTeam.beaters.starters.map((player: Player) => RenderPlayerCards({ player, position: 'Beater', depth: selectedHomeTeam.beaters })) }
                        { selectedHomeTeam.seekers.starters.map((player: Player) => RenderPlayerCards({ player, position: 'Seeker', depth: selectedHomeTeam.seekers })) }
                    </Grid>
                    <Divider flexItem orientation={'vertical'} sx={{ pl: 2 }} />
                    <Grid container spacing={2} alignItems={'center'} justifyContent={'center'} sx={{ width: '100%' }}>
                        { selectedAwayTeam.keepers.starters.map((player: Player) => RenderPlayerCards({ player, position: 'Keeper', depth: selectedAwayTeam.keepers })) }
                        { selectedAwayTeam.chasers.starters.map((player: Player) => RenderPlayerCards({ player, position: 'Chaser', depth: selectedAwayTeam.chasers })) }
                        { selectedAwayTeam.beaters.starters.map((player: Player) => RenderPlayerCards({ player, position: 'Beater', depth: selectedAwayTeam.beaters })) }
                        { selectedAwayTeam.seekers.starters.map((player: Player) => RenderPlayerCards({ player, position: 'Seeker', depth: selectedAwayTeam.seekers })) }
                    </Grid>
                </Stack>
            }
        </Container>
    )
};

// ----------------------------------------------------------------------

type GamePlayProps = {
    homeTeam: Team,
    awayTeam: Team,
};

function GamePlay({ homeTeam, awayTeam }: GamePlayProps) {

    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const [homeStats, setHomeStats] = useState<TeamStats>(default_stats);
    const [awayStats, setAwayStats] = useState<TeamStats>(default_stats);
    const [gameTime, setGameTime] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [showHomeLog, setShowHomeLog] = useState<boolean>(false);
    const [showAwayLog, setShowAwayLog] = useState<boolean>(false);

    useEffect(() => {
        if (!gameOver) {
            if (gameTime >= GAME_MINUTES) {
                setGameOver(true);
                enqueueSnackbar('Game Over!', { variant: 'success' });
                return;
            }
            const timer = setInterval(() => {
                setGameTime(prevGameTime => prevGameTime + MINUTE_INCREMENT);
                const gameCompletePercentage = (gameTime/GAME_MINUTES);
                const minuteIncrement = MINUTE_INCREMENT;
                gameplay({ gameCompletePercentage, minuteIncrement, homeTeam, awayTeam, homeStats, setHomeStats, awayStats, setAwayStats });
            }, (MINUTE_INCREMENT * INCREMENT_MULTIPLIER));
            return () => clearInterval(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameTime, gameOver, homeTeam, awayTeam, homeStats, awayStats]);

    return (
        <Stack spacing={2} alignItems={'center'} sx={{ width: '100%' }}>
            { gameOver ?
                <Typography variant={'h6'}>{homeStats.score > awayStats.score ? homeTeam.name : awayTeam.name} Wins!</Typography> :
                <Typography variant={'h6'}>Game Time: {gameTime}/{GAME_MINUTES}</Typography>
            }
            <Box sx={{ width: '100%' }}>
                <LinearProgress
                    variant="determinate"
                    value={(gameTime/GAME_MINUTES * 100)}
                    sx={{
                        bgcolor: alpha(theme.palette.common.black, theme.palette.action.selectedOpacity),
                        '& .MuiLinearProgress-barColorPrimary': {
                            backgroundColor: theme.palette.primary.main,
                        },
                    }}
                />
            </Box>

            {/* <MomentumLine homeStats={homeStats} awayStats={awayStats} gameOver={gameOver} /> */}

            <GraphAllSections
                homeTeam={homeTeam}
                homeStats={homeStats}
                awayTeam={awayTeam}
                awayStats={awayStats}
            />

            <Stack spacing={2} alignItems="center" sx={{ width: '100%' }} direction="row">
                <TeamInfoStack
                    teamName={homeTeam.name}
                    score={homeStats.score}
                    momentum={homeStats.momentum}
                    showLog={showHomeLog}
                    toggleLog={() => { setShowHomeLog(!showHomeLog) }}
                    actionLog={homeStats.action_log}
                />
                <Divider orientation="vertical" flexItem />
                <TeamInfoStack
                    teamName={awayTeam.name}
                    score={awayStats.score}
                    momentum={awayStats.momentum}
                    showLog={showAwayLog}
                    toggleLog={() => { setShowAwayLog(!showAwayLog) }}
                    actionLog={awayStats.action_log}
                />
            </Stack>
        </Stack>
    )
};

// ----------------------------------------------------------------------

type RenderPlayerCardsProps = {
    player: Player,
    position: "Seeker" | "Keeper" | "Chaser" | "Beater",
    depth: PositionDepth,
}

function RenderPlayerCards({ player, position, depth }: RenderPlayerCardsProps) {
    return (
        <Grid item xs={12} key={player.id + position + (Math.random() * 10000)}>
            <PlayerCard
                player={player}
                selectedPlayer={null}
                setSelectedPlayer={() => {}}
                depth={depth}
                setCurrentDepth={() => {}}
                is_starter={true}
                position={position}
            />
        </Grid>
    )
};

// ----------------------------------------------------------------------

function checkIfAllStartersFilled(team: Team) {
    return (
        team.seekers.starters.length === numStarters.seekers &&
        team.keepers.starters.length === numStarters.keepers &&
        team.chasers.starters.length === numStarters.chasers &&
        team.beaters.starters.length === numStarters.beaters
    )
};

const default_stats: TeamStats = {
    momentum: [],
    snitch_catches: [],
    score: 0,
    goals_scored: [],
    scoring_chances: [],
    attacks: [],
    action_log: [],
    opponent_stops: [],
};