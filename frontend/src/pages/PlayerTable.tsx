import {
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    alpha,
    useTheme
} from "@mui/material";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Player, PlayerSort, Team } from "src/@types/types";
import Iconify from "src/components/Iconify";
import { MetadataContext } from "src/contexts/MetadataContext";
import { numStarters } from "./Home";
import { useSnackbar } from "notistack";

// ----------------------------------------------------------------------

type PlayerTableProps = {
    allPlayers: Player[];
    setAllPlayers: Dispatch<SetStateAction<Player[]>>;
}

export default function PlayerTable({ allPlayers, setAllPlayers }: PlayerTableProps) {

    const { enqueueSnackbar } = useSnackbar();
    const { allLeagues, setAllLeagues } = useContext(MetadataContext);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [sort, setSort] = useState<PlayerSort>({
        id: null,
        first_name: null,
        last_name: null,
        team_name: null,
        position: null,
        speed: null,
        strength: null,
        stamina: null,
        tactics: null,
        teamwork: null,
        morale: null,
        awareness: null,
        shooting: null,
        passing: null,
        catching: null,
        beating: null,
        defense: null
    });

    const handleFieldChange = (player: Player, field: string, newValue: string | number) => {
        let newAllLeagues = [...allLeagues];
    
        if (field === 'team') {
            const team = newAllLeagues.flatMap(league => league.teams).find(team => team.name === newValue) || '-';

            player.team = team;
    
            if (team !== '-') {
                const positionArrayKey = `${player.position.toLowerCase()}s` as 'seekers' | 'keepers' | 'chasers' | 'beaters';

                if (team[positionArrayKey].starters.length < numStarters[positionArrayKey]) {
                    team[positionArrayKey].starters.push(player);
                }
                else {
                    team[positionArrayKey].backups.push(player);
                }
            }
        }
        else if (field === 'position') {
            const team = player.team;
    
            if (team !== '-') {
                // can't change position if player is on a team right now
                enqueueSnackbar('Cannot change position of player on a team', { variant: 'error' });
            } else {
                player.position = newValue as 'Seeker' | 'Keeper' | 'Chaser' | 'Beater';
            }
        }
        else {
            (player as any)[field] = newValue;
        }
    
        setAllLeagues(newAllLeagues);
    };    

    useEffect(() => {
        let sortedPlayers = [...allPlayers];
        sortedPlayers.sort((a, b) => {
            for (const field in sort) {
                if (sort[field as keyof typeof sort] !== null) {
                    if (field === 'team_name') {
                        const aTeamName = (a.team as Team).name || '-';
                        const bTeamName = (b.team as Team).name || '-';
                        if (aTeamName !== bTeamName) {
                            const compare = aTeamName < bTeamName ? -1 : 1;
                            return sort[field as keyof typeof sort] === 'asc' ? compare : -compare;
                        }
                    }
                    const aField = a[field as keyof typeof a];
                    const bField = b[field as keyof typeof b];
                    if (aField !== bField) {
                        const compare = aField! < bField! ? -1 : 1;
                        return sort[field as keyof typeof sort] === 'asc' ? compare : -compare;
                    }
                }
            }
            return 0;
        });
        setAllPlayers(sortedPlayers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort]);

    return (
        <PlayerTableDisplay
            isEdit={true}
            allPlayers={allPlayers}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
            handleFieldChange={handleFieldChange}
            sort={sort}
            setSort={setSort}
        />
    )
};

// ----------------------------------------------------------------------

type PlayerTableDisplayProps = {
    isEdit: boolean;
    allPlayers: Player[];
    selectedPlayer: Player | null;
    setSelectedPlayer: (player: Player | null) => void;
    sort: PlayerSort;
    setSort: (sort: PlayerSort) => void;
    handleFieldChange?: (player: Player, field: string, newValue: string | number) => void;
}

export function PlayerTableDisplay({ isEdit, allPlayers, selectedPlayer, setSelectedPlayer, sort, setSort, handleFieldChange }: PlayerTableDisplayProps) {

    const theme = useTheme();
    const label_color = theme.palette.text.secondary;
    const { allLeagues } = useContext(MetadataContext);
    const teamNames = allLeagues.map(league => league.teams.map(team => team.name)).flat();

    const cell_sx = {
        color: label_color,
        backgroundColor: theme.palette.grey[900],
        '&:first-of-type': { boxShadow: 'none' },
        '&:last-of-type': { boxShadow: 'none' },
    };

    const table_fields = {
        first_name: 'First Name',
        last_name: 'Last Name',
        position: 'Position',
        team_name: 'Team',
        speed: 'Speed',
        strength: 'Strength',
        stamina: 'Stamina',
        tactics: 'Tactics',
        teamwork: 'Teamwork',
        morale: 'Morale',
        awareness: 'Awareness',
        shooting: 'Shooting',
        passing: 'Passing',
        catching: 'Catching',
        beating: 'Beating',
        defense: 'Defense'
    };
    
    function getField(old_sort_direction: 'asc' | 'desc' | null) {
        if (old_sort_direction === null) {
            return 'desc';
        }
        if (old_sort_direction === 'desc') {
            return 'asc';
        }
        if (old_sort_direction === 'asc') {
            return null;
        }
    };

    return (
        <TableContainer sx={{ width: '100%', height: '95vh' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        { isEdit && <TableCell align={'center'} sx={cell_sx}>Edit</TableCell> }
                        {Object.keys(table_fields).map((field) => (
                            <TableCell key={field} align={'center'} sx={cell_sx}>
                                <TableSortLabel
                                    active={sort[field as keyof typeof sort] !== null}
                                    direction={sort[field as keyof typeof sort] === 'asc' ? 'asc' : 'desc'}
                                    onClick={() => {
                                        setSort({ ...sort, [field]: getField(sort[field as keyof typeof sort]) })
                                    }}
                                >
                                    {table_fields[field as keyof typeof table_fields]}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                        { isEdit && <TableCell align={'center'} sx={cell_sx}>Edit</TableCell> }
                    </TableRow>
                </TableHead>

                <TableBody sx={{ '& > :nth-of-type(2n+2)': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                    {allPlayers.map((player) => (
                        <PlayerRow
                            key={player.id}
                            isEdit={isEdit}
                            teamNames={teamNames}
                            player={player}
                            selectedPlayer={selectedPlayer}
                            setSelectedPlayer={setSelectedPlayer}
                            handleFieldChange={handleFieldChange}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
};

// ----------------------------------------------------------------------

type PlayerRowProps = {
    isEdit: boolean;
    teamNames: string[];
    player: Player;
    selectedPlayer: Player | null;
    setSelectedPlayer: (player: Player | null) => void;
    handleFieldChange?: (player: Player, field: string, newValue: string | number) => void;
}

function PlayerRow({ isEdit, teamNames, player, selectedPlayer, setSelectedPlayer, handleFieldChange }: PlayerRowProps) {

    const [editing, setEditing] = useState<boolean>(false);

    const theme = useTheme();
    const cell_color = theme.palette.primary.main;
    const selected_cell_color = alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity);
    const selected_player_color = theme.palette.primary.light;
    
    const cell_sx = {
        color: selectedPlayer && selectedPlayer.id === player.id ? selected_player_color : cell_color,
    };
    
    return (
        <TableRow
            onMouseEnter={() => { setSelectedPlayer(player) }}
            onMouseLeave={() => { setSelectedPlayer(null) }}
            sx={{ transition: '0.25s background-color;', '&:hover': { bgcolor: selected_cell_color }, pb: 1 }}
        >
            { isEdit &&
                <TableCell
                    align={'left'}
                    sx={cell_sx}
                >
                    <IconButton onClick={() => { setEditing(!editing) }}>
                        <Iconify icon={'eva:edit-outline'} width={18} height={18}/>
                    </IconButton>
                </TableCell>
            }
            { Object.entries({ ...player }).map(([key, value]) => {
                if (key === 'id' || key === 'stats') return null
                else if (key === 'team') return (
                    <TableCell align="center" sx={cell_sx} key={'info' + key + (player.id).toString()}>
                        {!editing ? value === '-' ? '-' : (value as Team).name
                        :
                            <FormControl fullWidth>
                                <InputLabel>Team</InputLabel>
                                <Select
                                    value={value === '-' ? '-' : (value as Team).name}
                                    label="Team"
                                    onChange={(e) => handleFieldChange && handleFieldChange(player, key, e.target.value )}
                                >
                                    <MenuItem value={'-'}>-</MenuItem>
                                    {teamNames.map((teamName) => (
                                        <MenuItem key={teamName} value={teamName}>{teamName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        }
                    </TableCell>
                )
                else if (key === 'position') return (
                    <TableCell align="center" sx={cell_sx} key={'info' + key + (player.id).toString()}>
                        {!editing ? value.toString()
                        :
                            <FormControl fullWidth>
                                <InputLabel>Position</InputLabel>
                                <Select
                                    value={value as string}
                                    label="Position"
                                    onChange={(e) => handleFieldChange && handleFieldChange(player, key, e.target.value )}
                                >
                                    <MenuItem value={'Seeker'}>Seeker</MenuItem>
                                    <MenuItem value={'Keeper'}>Keeper</MenuItem>
                                    <MenuItem value={'Chaser'}>Chaser</MenuItem>
                                    <MenuItem value={'Beater'}>Beater</MenuItem>
                                </Select>
                            </FormControl>
                        }
                    </TableCell>
                )
                else return (
                    <TableCell align="center" sx={cell_sx} key={'info' + key + (player.id).toString()}>
                        {!editing ? value.toString()
                        :
                            <TextField
                                variant={'outlined'}
                                value={value}
                                size={'small'}
                                onChange={(e) => handleFieldChange && handleFieldChange(player, key, e.target.value )}
                            />
                        }
                    </TableCell>
                );
            })}
            { isEdit &&
                <TableCell
                    align={'center'}
                    sx={cell_sx}
                >
                    <IconButton onClick={() => { setEditing(!editing) }}>
                        <Iconify icon={'eva:edit-outline'} width={18} height={18}/>
                    </IconButton>
                </TableCell>
            }
        </TableRow>
    )
};