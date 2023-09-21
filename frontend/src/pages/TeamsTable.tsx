import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    Container,
    Dialog,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    alpha,
    useTheme
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { League, Player, PositionDepth, Team } from "src/@types/types";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Iconify from "src/components/Iconify";
import { MetadataContext } from "src/contexts/MetadataContext";
import { numStarters } from "./Home";
import { getStatColor } from "../utils/getStatColor";
import { PlayerCard } from "../components/PlayerCard";

// ----------------------------------------------------------------------

export type StatsType = 'speed' | 'strength' | 'stamina' | 'tactics' | 'teamwork' | 'morale' | 'awareness' | 'shooting' | 'passing' | 'catching' | 'beating' | 'defense';
export const ALL_STATS = ['Speed', 'Strength', 'Stamina', 'Tactics', 'Teamwork', 'Morale', 'Awareness', 'Shooting', 'Passing', 'Catching', 'Beating', 'Defense'];
export const BEATER_STATS = ['Speed', 'Strength', 'Stamina', 'Tactics', 'Teamwork', 'Morale', 'Awareness', 'Beating', 'Defense'];
export const KEEPER_STATS = ['Speed', 'Strength', 'Stamina', 'Tactics', 'Teamwork', 'Morale', 'Awareness', 'Defense', 'Passing'];
export const CHASER_STATS = ['Speed', 'Stamina', 'Tactics', 'Teamwork', 'Morale', 'Awareness', 'Shooting', 'Passing', 'Defense'];
export const SEEKER_STATS = ['Speed', 'Stamina', 'Tactics', 'Morale', 'Awareness', 'Catching'];
// ----------------------------------------------------------------------

export default function TeamsTable() {

    const { allLeagues, setAllLeagues } = useContext(MetadataContext);
    const [addNewLeague, setAddNewLeague] = useState<boolean>(false);
    const [newLeagueName, setNewLeagueName] = useState<string>('');

    function createNewLeague(name: string) {
        const newLeague: League = {
            id: allLeagues.length + 1,
            name: name,
            teams: []
        };
        const new_leagues = [...allLeagues, newLeague];
        setAllLeagues(new_leagues);
        setNewLeagueName('');
        setAddNewLeague(false);
    };

    return (
        <Container maxWidth={false}>
            <Stack spacing={2} alignItems={'center'} sx={{ width: '100%' }}>
                { allLeagues.map(league =>
                    <LeagueDiv
                        key={league.id}
                        league={league}
                    />
                )}
                <IconButton onClick={() => setAddNewLeague(true)}>
                    <Iconify icon={'eva:plus-fill'} />
                </IconButton>
                <Dialog open={addNewLeague} onClose={() => { setAddNewLeague(false) }}>
                    <Card sx={{ p: 1 }}>
                        <Stack spacing={2}>
                            <Typography variant={'h6'}>Add New League</Typography>
                            <TextField
                                label={'League Name'}
                                variant={'outlined'}
                                size={'small'}
                                value={newLeagueName}
                                onChange={(e) => { setNewLeagueName(e.target.value) }}
                            />
                            <Button variant={'contained'} onClick={() => { createNewLeague(newLeagueName) }}>Add</Button>
                        </Stack>
                    </Card>
                </Dialog>
            </Stack>
        </Container>
    )
};

// ----------------------------------------------------------------------

type LeagueDivProps = {
    league: League;
};

function LeagueDiv({ league }: LeagueDivProps) {

    const theme = useTheme();

    const [open, setOpen] = useState<boolean>(false);
    const [addNewTeam, setAddNewTeam] = useState<boolean>(false);
    const [newTeamName, setNewTeamName] = useState<string>('');
  
    function createNewTeam(name: string) {
        const newTeam: Team = {
            id: league.teams.length + 1,
            name: name,
            stats: {
                momentum: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                goals_scored: 0,
                goals_allowed: 0,
                snitch_scored: 0,
                snitch_allowed: 0,
            },
            seekers: {
                starters: [],
                backups: [],
            },
            keepers: {
                starters: [],
                backups: [],
            },
            chasers: {
                starters: [],
                backups: [],
            },
            beaters: {
                starters: [],
                backups: [],
            }
        };
        league.teams.push(newTeam);
        setNewTeamName('');
        setAddNewTeam(false);
    };

    const accordian_transition: string = '0.5s background-color;';
    const text_transition: string = '0.5s color;';
    const open_background_color = alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity);

    return (
        <Stack sx={{ width: '100%' }}>
            <Accordion disableGutters={true} expanded={open} sx={{ ...(open && { bgcolor: 'transparent' }) }} TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary
                onClick={() => { setOpen(!open) }}
                expandIcon={<ExpandMoreIcon />}
                sx={{
                borderRadius: '8px',
                transition: accordian_transition,
                color: theme.palette.text.secondary,
                ...(open && { bgcolor: open_background_color }),
                }}
            >
                <Typography sx={{ transition: text_transition, ...(open && { color: theme.palette.primary.main }) }}>{league.name}</Typography>
            </AccordionSummary>
    
            <AccordionDetails sx={{ pt: 3 }}>
                <Stack spacing={3} alignItems={'center'} justifyContent={'center'}>
                    { league.teams.map(team =>
                        <TeamDiv
                            key={team.id}
                            team={team}
                        />
                    )}
                    <Box>
                        <IconButton onClick={() => setAddNewTeam(true)}>
                            <Iconify icon={'eva:plus-fill'} />
                        </IconButton>
                    </Box>
                    <Dialog open={addNewTeam} onClose={() => { setAddNewTeam(false) }}>
                        <Card sx={{ p: 1 }}>
                            <Stack spacing={2}>
                                <Typography variant={'h6'}>Add New Team</Typography>
                                <TextField
                                    label={'Team Name'}
                                    variant={'outlined'}
                                    size={'small'}
                                    value={newTeamName}
                                    onChange={(e) => { setNewTeamName(e.target.value) }}
                                />
                                <Button variant={'contained'} onClick={() => { createNewTeam(newTeamName) }}>Add</Button>
                            </Stack>
                        </Card>
                    </Dialog>
                </Stack>
            </AccordionDetails>
            </Accordion>
        </Stack>
    )
};

// ----------------------------------------------------------------------

type TeamDivProps = {
    team: Team;
};

function TeamDiv({ team }: TeamDivProps) {
    
    const theme = useTheme();

    const [open, setOpen] = useState<boolean>(false);
    const [selectedPosition, setSelectedPosition] = useState<'Seeker' | 'Keeper' | 'Chaser' | 'Beater' | null>(null);
    const [currentDepth, setCurrentDepth] = useState<PositionDepth | null>(null);

    useEffect(() => {
        if (selectedPosition) {
            setCurrentDepth(team[selectedPosition.toLowerCase() + 's' as 'seekers' | 'keepers' | 'chasers' | 'beaters']);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPosition]);

    const accordian_transition: string = '0.5s background-color;';
    const text_transition: string = '0.5s color;';
    const open_background_color = alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity);

    return (
        <Stack sx={{ width: '100%' }}>
            <Accordion disableGutters={true} expanded={open} sx={{ ...(open && { bgcolor: 'transparent' }) }} TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary
                onClick={() => { setOpen(!open) }}
                expandIcon={<ExpandMoreIcon />}
                sx={{
                borderRadius: '8px',
                transition: accordian_transition,
                color: theme.palette.text.secondary,
                ...(open && { bgcolor: open_background_color }),
                }}
            >
                <Typography sx={{ transition: text_transition, ...(open && { color: theme.palette.primary.main }) }}>
                    {team.name} ({
                        countStartersOfPosition(team, 'Seeker') +
                        countStartersOfPosition(team, 'Keeper') +
                        countStartersOfPosition(team, 'Chaser') +
                        countStartersOfPosition(team, 'Beater')
                    }/{numStarters.total})
                </Typography>
            </AccordionSummary>
    
            <AccordionDetails sx={{ pt: 3 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={2} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                            <Stack
                                spacing={2}
                                alignItems={'center'}
                                justifyContent={'space-around'}
                                direction={'row'}
                                width={'100%'}
                            >
                                <Stack spacing={2} alignItems={'center'} justifyContent={'center'}>
                                    <Typography variant={'h6'}>Stats</Typography>
                                    <Typography variant={'body1'}>Wins: {team.stats.wins}</Typography>
                                    <Typography variant={'body1'}>Losses: {team.stats.losses}</Typography>
                                    <Typography variant={'body1'}>Draws: {team.stats.draws}</Typography>
                                    <Typography variant={'body1'}>Momentum: {team.stats.momentum}</Typography>
                                </Stack>
                                <ToggleButtonGroup
                                    value={selectedPosition}
                                    exclusive
                                    onChange={(e, value) => { setSelectedPosition(value) }}
                                    orientation="vertical"
                                    color={'primary'}
                                >
                                    <ToggleButton value={'Seeker'}>Seekers ({countPlayersOfPosition(team, 'Seeker')}/{numStarters.seekers})</ToggleButton>
                                    <ToggleButton value={'Keeper'}>Keepers ({countPlayersOfPosition(team, 'Keeper')}/{numStarters.keepers})</ToggleButton>
                                    <ToggleButton value={'Chaser'}>Chasers ({countPlayersOfPosition(team, 'Chaser')}/{numStarters.chasers})</ToggleButton>
                                    <ToggleButton value={'Beater'}>Beaters ({countPlayersOfPosition(team, 'Beater')}/{numStarters.beaters})</ToggleButton>
                                </ToggleButtonGroup>
                            </Stack>

                            <Divider flexItem />

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <PositionSummary
                                        depth={currentDepth}
                                        position={selectedPosition}
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <PositionSelection
                            selectedPosition={selectedPosition}
                            depth={currentDepth}
                            setCurrentDepth={setCurrentDepth}
                        />
                    </Grid>
                </Grid>
            </AccordionDetails>
            </Accordion>
        </Stack>
    )
};

// ----------------------------------------------------------------------

type PositionSummaryProps = {
    depth: PositionDepth | null;
    position: 'Seeker' | 'Keeper' | 'Chaser' | 'Beater' | null;
};

function PositionSummary({ depth, position }: PositionSummaryProps) {

    const theme = useTheme();

    function getPositionStarterAverage(stat: string): number {
        const starters = depth ? depth.starters : [];
        const total_starters = starters.length;
        if (total_starters === 0) return 0;
        let total_stat = 0;
        starters.forEach(player => {
            const stat_value = (player[stat.toLowerCase() as StatsType]) * 1;
            total_stat += stat_value;
        });
        return Math.floor(total_stat / total_starters);
    };

    if (position === null) return null;

    return (
        <Card sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Stack alignItems={'center'} justifyContent={'center'} width={'100%'} direction={'row'}>
                        <Typography variant={'body1'}>Position Starter Average</Typography>
                    </Stack>
                </Grid>

                { ALL_STATS.map(stat =>
                    <Grid item xs={6} key={stat}>
                        <Grid container sx={{ alignItems: 'center' }} spacing={0}>
                            <Grid item xs={5}>
                                <Stack alignItems={'center'} justifyContent={'flex-start'} width={'100%'} direction={'row'}>
                                    <Typography
                                        variant={'subtitle2'}
                                        color={
                                            (position === 'Seeker' && !SEEKER_STATS.includes(stat)) ||
                                            (position === 'Keeper' && !KEEPER_STATS.includes(stat)) ||
                                            (position === 'Chaser' && !CHASER_STATS.includes(stat)) ||
                                            (position === 'Beater' && !BEATER_STATS.includes(stat))
                                            ? theme.palette.text.disabled : theme.palette.text.primary
                                        }
                                    >{stat}: {getPositionStarterAverage(stat)}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={7}>
                                <Stack alignItems={'center'} justifyContent={'flex-start'} width={'100%'} direction={'row'}>
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={getPositionStarterAverage(stat)}
                                            sx={{
                                                bgcolor: alpha(theme.palette.common.black, theme.palette.action.selectedOpacity),
                                                '& .MuiLinearProgress-barColorPrimary': {
                                                    backgroundColor: getStatColor(getPositionStarterAverage(stat)),
                                                },
                                            }}
                                        />
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Card>
    )
}

// ----------------------------------------------------------------------

type PositionSelectionProps = {
    selectedPosition: 'Seeker' | 'Keeper' | 'Chaser' | 'Beater' | null;
    depth: PositionDepth | null;
    setCurrentDepth: (depth: PositionDepth | null) => void;
};

function PositionSelection({ selectedPosition, depth, setCurrentDepth }: PositionSelectionProps) {

    return (
        <Stack spacing={2} alignItems={'center'} justifyContent={'center'}>
            {selectedPosition === null &&
                <Stack spacing={2} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                    <Typography variant={'body1'}>Select a position to view players</Typography>
                </Stack>
            }
            { selectedPosition !== null && depth !== null &&
                <PositionDiv
                    position={selectedPosition}
                    depth={depth}
                    setCurrentDepth={setCurrentDepth}
                />
            }
        </Stack>
    )
};

// ----------------------------------------------------------------------

type PositionDivProps = {
    position: 'Seeker' | 'Keeper' | 'Chaser' | 'Beater';
    depth: PositionDepth;
    setCurrentDepth: (depth: PositionDepth | null) => void;
};

function PositionDiv({ position, depth, setCurrentDepth }: PositionDivProps) {

    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    useEffect(() => { setSelectedPlayer(null) }, [position]);

    const total_starters = depth.starters.length;
    const total_backups = depth.backups.length;
    const starters_needed = numStarters[position.toLowerCase() + 's' as keyof typeof numStarters];

    return (
        <Stack spacing={2} alignItems={'center'} justifyContent={'center'} width={'100%'}>
            <Typography variant={'h6'}>Starting {position}s ({total_starters}/{starters_needed})</Typography>
            { depth.starters.map(player =>
                <PlayerCard
                    key={player.id + position}
                    position={position}
                    is_starter={true}
                    depth={depth}
                    setCurrentDepth={setCurrentDepth}
                    player={player}
                    selectedPlayer={selectedPlayer}
                    setSelectedPlayer={setSelectedPlayer}
                />
            )}
            <Divider flexItem />
            <Typography variant={'h6'}>Reserve {position}s ({total_backups})</Typography>
            { depth.backups.map(player =>
                <PlayerCard
                    key={player.id + position}
                    position={position}
                    is_starter={false}
                    depth={depth}
                    setCurrentDepth={setCurrentDepth}
                    player={player}
                    selectedPlayer={selectedPlayer}
                    setSelectedPlayer={setSelectedPlayer}
                />
            )}
        </Stack>
    )
};

// ----------------------------------------------------------------------

function countPlayersOfPosition(team: Team, position: string): number {
    const position_name = position.toLowerCase() + 's' as 'seekers' | 'keepers' | 'chasers' | 'beaters';
    return team[position_name].starters.length + team[position_name].backups.length;
};

function countStartersOfPosition(team: Team, position: string): number {
    const position_name = position.toLowerCase() + 's' as 'seekers' | 'keepers' | 'chasers' | 'beaters';
    return team[position_name].starters.length;
};

