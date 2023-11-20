import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card, Stack,
    Typography,
    alpha,
    useTheme
} from "@mui/material";
import { useState } from "react";
import { Player, Team } from "src/@types/types";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// ----------------------------------------------------------------------
type TeamCardProps = {
    team: Team;
    setTeam: (team: Team) => void;
};
export function TeamCard({ team, setTeam }: TeamCardProps) {

    const theme = useTheme();
    
    const [open, setOpen] = useState<boolean>(false);

    const accordian_transition: string = '0.5s background-color;';
    const text_transition: string = '0.5s color;';
    const open_background_color = alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity);

    return (
        <Card sx={{ p: 2, width: '100%' }}>
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
                        {team.name}
                    </Typography>
                </AccordionSummary>
        
                <AccordionDetails sx={{ pt: 3 }}>
                    <Stack spacing={2} alignItems={'center'} justifyContent={'center'}>
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
                    </Stack>
                </AccordionDetails>
            </Accordion>
            <Button fullWidth variant={'contained'} key={team.id + 'home'} onClick={() => { setTeam(team); }}>
                Select
            </Button>
        </Card>
    );
}