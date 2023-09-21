import {
    Box, Card, Divider, Grid, LinearProgress,
    Stack, Typography,
    alpha,
    useTheme
} from "@mui/material";
import { Player, PositionDepth } from "src/@types/types";
import { getStatColor } from "../utils/getStatColor";
import { ALL_STATS, SEEKER_STATS, KEEPER_STATS, CHASER_STATS, BEATER_STATS, StatsType } from "../pages/TeamsTable";
import { fNumber } from "src/utils/formatNumber";

// ----------------------------------------------------------------------

const STAT_KEYS = ['goals', 'scoring_chances', 'stops', 'snitch_catches'];

type PlayerCardProps = {
    position: 'Seeker' | 'Keeper' | 'Chaser' | 'Beater';
    is_starter: boolean;
    depth: PositionDepth;
    setCurrentDepth: (depth: PositionDepth | null) => void;
    player: Player;
    selectedPlayer: Player | null;
    setSelectedPlayer: (player: Player | null) => void;
};

// ----------------------------------------------------------------------

export function PlayerCard({ position, is_starter, depth, setCurrentDepth, player, selectedPlayer, setSelectedPlayer }: PlayerCardProps) {

    const theme = useTheme();

    function swapPlayerPositions(player: Player, selectedPlayer: Player | null) {
        if (!selectedPlayer) {
            setSelectedPlayer(player);
            return;
        }

        if (player.team === '-' || selectedPlayer.team === '-') return;

        if (selectedPlayer.id === player.id) {
            setSelectedPlayer(null);
            return;
        }

        let newStarters = [...depth.starters];
        let newBackups = [...depth.backups];

        if (is_starter) {
            if (!newStarters.includes(selectedPlayer)) {
                newStarters = newStarters.filter(p => p.id !== player.id);
                newBackups = newBackups.filter(p => p.id !== selectedPlayer.id);

                newStarters.push(selectedPlayer);
                newBackups.push(player);
            }
        } else {
            if (!newBackups.includes(selectedPlayer)) {
                newStarters = newStarters.filter(p => p.id !== selectedPlayer.id);
                newBackups = newBackups.filter(p => p.id !== player.id);

                newStarters.push(player);
                newBackups.push(selectedPlayer);
            }
        }

        setCurrentDepth({ starters: newStarters, backups: newBackups });
        setSelectedPlayer(null);
    };

    return (
        <Card
            sx={{
                p: 2,
                ...(selectedPlayer && selectedPlayer.id === player.id && { bgcolor: theme.palette.primary.light }),
                cursor: 'pointer',
            }}
            onClick={() => { swapPlayerPositions(player, selectedPlayer); }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Stack alignItems={'center'} justifyContent={'center'} width={'100%'} direction={'row'}>
                        <Typography variant={'body1'}>{player.first_name} {player.last_name} ({position})</Typography>
                    </Stack>
                </Grid>

                {ALL_STATS.map(stat =>
                    <Grid item xs={6} key={stat + player.id}>
                        <Grid container sx={{ alignItems: 'center' }} spacing={0}>
                            <Grid item xs={5}>
                                <Stack alignItems={'center'} justifyContent={'flex-start'} width={'100%'} direction={'row'}>
                                    <Typography
                                        variant={'subtitle2'}
                                        color={(position === 'Seeker' && !SEEKER_STATS.includes(stat)) ||
                                            (position === 'Keeper' && !KEEPER_STATS.includes(stat)) ||
                                            (position === 'Chaser' && !CHASER_STATS.includes(stat)) ||
                                            (position === 'Beater' && !BEATER_STATS.includes(stat))
                                            ? theme.palette.text.disabled : theme.palette.text.primary}
                                    >
                                        {stat}: {player[stat.toLowerCase() as StatsType]}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={7}>
                                <Stack alignItems={'center'} justifyContent={'flex-start'} width={'100%'} direction={'row'}>
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={player[stat.toLowerCase() as StatsType]}
                                            sx={{
                                                bgcolor: alpha(theme.palette.common.black, theme.palette.action.selectedOpacity),
                                                '& .MuiLinearProgress-barColorPrimary': {
                                                    backgroundColor: (
                                                        (position === 'Seeker' && !SEEKER_STATS.includes(stat)) ||
                                                        (position === 'Keeper' && !KEEPER_STATS.includes(stat)) ||
                                                        (position === 'Chaser' && !CHASER_STATS.includes(stat)) ||
                                                        (position === 'Beater' && !BEATER_STATS.includes(stat))
                                                    ) ? theme.palette.text.disabled : getStatColor(player[stat.toLowerCase() as StatsType]),
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

            <Divider flexItem sx={{ my: 2 }} />

            <Grid container spacing={2}>
                {STAT_KEYS.map(stat =>
                    <Grid item key={stat + player.id} xs={3}>
                        <Stack spacing={1} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                            <Typography variant={'subtitle2'} sx={{ whiteSpace: 'nowrap' }}>
                                {getStatDisplayName(stat)}
                            </Typography>
                            <Divider flexItem sx={{ my: 2 }} />
                            <Typography variant={'subtitle2'}>
                                {fNumber(player.stats[stat as keyof typeof player.stats])}
                            </Typography>
                        </Stack>
                    </Grid>
                )}
            </Grid>
        </Card>
    );
};

// ----------------------------------------------------------------------

function getStatDisplayName(stat: string) {
    switch (stat) {
        case 'goals':
            return 'Goals';
        case 'scoring_chances':
            return 'Scoring Chances';
        // case 'attacks':
        //     return 'Attacks';
        case 'stops':
            return 'Stops';
        case 'snitch_catches':
            return 'Snitch Catches';
        default:
            return '';
    }
}