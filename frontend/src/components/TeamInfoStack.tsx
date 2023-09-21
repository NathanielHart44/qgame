import {
    Divider, Stack,
    Switch,
    Typography
} from "@mui/material";

// ----------------------------------------------------------------------
type TeamInfoStackProps = {
    teamName: string;
    score: number;
    momentum: number[];
    showLog: boolean;
    toggleLog: () => void;
    actionLog: string[];
};
export function TeamInfoStack({ teamName, score, momentum, showLog, toggleLog, actionLog }: TeamInfoStackProps) {

    return (
        <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
            <Typography variant="h6">Team: {teamName}</Typography>
            <Typography variant="h6">Score: {score}</Typography>
            <Divider orientation="horizontal" flexItem />
            <Stack spacing={1} alignItems="center" justifyContent="space-between" sx={{ width: '100%' }} direction="row">
                <Typography>Momentum: {momentum[momentum.length - 1]}</Typography>
                <Stack spacing={1} alignItems="center" justifyContent="flex-end" sx={{ width: '100%' }} direction="row">
                    <Typography variant="h6">{teamName} Log</Typography>
                    <Switch
                        checked={showLog}
                        onChange={toggleLog} />
                </Stack>
            </Stack>
            <Divider orientation="horizontal" flexItem />
            {showLog && actionLog.map((line, index) => (
                <Typography key={index}>{line}</Typography>
            ))}
        </Stack>
    );
}
;
