import { Stack, useTheme } from "@mui/material";
import { TeamStats } from "src/@types/types";
import Iconify from "src/components/Iconify";

// ----------------------------------------------------------------------
type MomentumLineProps = {
    homeStats: TeamStats;
    awayStats: TeamStats;
    gameOver: boolean;
};
export function MomentumLine({ homeStats, awayStats, gameOver }: MomentumLineProps) {

    const theme = useTheme();
    const momentum_percentages = [10, 25, 50, 100, 200];

    function calculateColor(m1: number, m2: number, percentage: number) {
        if (percentage === 0 && gameOver) { return theme.palette.primary.main; };

        const threshold = Math.abs(m1 - m2);
        if (percentage === 0 && threshold < momentum_percentages[0]) {
            return theme.palette.primary.main;
        } else if (!gameOver && (m2 * (1 + (percentage * 0.01)) < m1)) {
            return theme.palette.primary.main;
        } else { return theme.palette.text.primary; };
    };

    return (
        <Stack spacing={2} alignItems={'center'} justifyContent={'center'} sx={{ width: '100%' }} direction={'row'}>
            {([...momentum_percentages].reverse()).map((percentage: number) => {
                return (
                    <Iconify
                        key={'back' + percentage}
                        icon={'eva:arrow-ios-back-outline'}
                        width={18}
                        height={18}
                        sx={{ color: calculateColor(homeStats.momentum[homeStats.momentum.length - 1], awayStats.momentum[awayStats.momentum.length - 1], percentage) }} />
                );
            })}
            <Iconify
                icon={'eva:more-vertical-outline'}
                width={18}
                height={18}
                sx={{ color: calculateColor(homeStats.momentum[homeStats.momentum.length - 1], awayStats.momentum[awayStats.momentum.length - 1], 0) }} />

            {momentum_percentages.map((percentage: number) => {
                return (
                    <Iconify
                        key={'forward' + percentage}
                        icon={'eva:arrow-ios-forward-outline'}
                        width={18}
                        height={18}
                        sx={{ color: calculateColor(awayStats.momentum[awayStats.momentum.length - 1], homeStats.momentum[homeStats.momentum.length - 1], percentage) }} />
                );
            })}
        </Stack>
    );
}
;
