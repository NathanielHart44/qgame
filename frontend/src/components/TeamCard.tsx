import {
    Button,
    Card, Stack,
    Typography
} from "@mui/material";
import { Player, Team } from "src/@types/types";

// ----------------------------------------------------------------------
type TeamCardProps = {
    team: Team;
    setTeam: (team: Team) => void;
};
export function TeamCard({ team, setTeam }: TeamCardProps) {
    return (
        <Card sx={{ p: 2 }}>
            <Stack spacing={2} alignItems={'center'} justifyContent={'center'}>
                <Typography variant={'h6'}>
                    {team.name}
                </Typography>
                <Typography variant={'body1'}>
                    Seeker: {team.seekers.starters[0].first_name} {team.seekers.starters[0].last_name}
                </Typography>
                <Typography variant={'body1'}>
                    Keeper: {team.keepers.starters[0].first_name} {team.keepers.starters[0].last_name}
                </Typography>
                {team.beaters.starters.map((player: Player) => {
                    return (
                        <Typography variant={'body1'}>Beater: {player.first_name} {player.last_name}</Typography>
                    );
                })}
                {team.chasers.starters.map((player: Player) => {
                    return (
                        <Typography variant={'body1'}>Chaser: {player.first_name} {player.last_name}</Typography>
                    );
                })}
                <Button fullWidth variant={'contained'} key={team.id + 'home'} onClick={() => { setTeam(team); }}>
                    Select
                </Button>
            </Stack>
        </Card>
    );
}
