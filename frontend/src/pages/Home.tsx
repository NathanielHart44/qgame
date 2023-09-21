import {
    Button,
    Stack,
    Typography,
} from "@mui/material";
import Page from "src/components/Page";
import PlayerTable from "./PlayerTable";
import TeamsTable from "./TeamsTable";
import { useContext, useState } from "react";
import { MetadataContext } from "src/contexts/MetadataContext";
import PlayGame from "./PlayGame";

// ----------------------------------------------------------------------

export const numStarters = {
    seekers: 1,
    keepers: 1,
    chasers: 3,
    beaters: 2,
    total: 7
};

export default function Home() {

    const { allPlayers, setAllPlayers } = useContext(MetadataContext);
    const [selectedPage, setSelectedPage] = useState<'Players' | 'Teams' | 'Game' | null>(null);

    return (
        <Page title="Home">
            <Stack spacing={3} width={'100%'} justifyContent={'center'} alignItems={'center'}>
                <Typography variant="h6" component="h2" color="textSecondary">
                    QGame
                </Typography>
                <Stack spacing={3} width={'100%'} justifyContent={'center'} alignItems={'center'} direction={'row'}>
                    <Button variant="contained" onClick={() => { setSelectedPage('Players') }}>
                        View Players
                    </Button>
                    <Button variant="contained" onClick={() => { setSelectedPage('Teams') }}>
                        View Teams
                    </Button>
                    <Button variant="contained" onClick={() => { setSelectedPage('Game') }}>
                        Play Game
                    </Button>
                    <Button variant="contained" onClick={() => { setSelectedPage(null) }}>
                        Clear
                    </Button>
                </Stack>
                { selectedPage === 'Players' && <PlayerTable allPlayers={allPlayers} setAllPlayers={setAllPlayers} /> }
                { selectedPage === 'Teams' && <TeamsTable /> }
                { selectedPage === 'Game' && <PlayGame /> }
            </Stack>
        </Page>
    );
};