import axios from "axios";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { League, Player } from "src/@types/types";
import { MAIN_API } from "src/config";
import useAuth from "src/hooks/useAuth";
import { checkTokenStatus, processTokens } from "src/utils/jwt";

type Props = { children: ReactNode };

export const MetadataContext = createContext<{
    isMobile: boolean;
    awaitingResponse: boolean;
    setAwaitingResponse: (awaiting: boolean) => void;

    allLeagues: League[];
    setAllLeagues: (leagues: League[]) => void;
    allPlayers: Player[];
    setAllPlayers: Dispatch<SetStateAction<Player[]>>;
}>
({
    isMobile: true,
    awaitingResponse: false,
    setAwaitingResponse: (awaiting: boolean) => { },

    allLeagues: [],
    setAllLeagues: (leagues: League[]) => { },
    allPlayers: [],
    setAllPlayers: () => { }
});

export default function MetadataProvider({ children }: Props) {
    const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);

    const [allLeagues, setAllLeagues] = useState<League[]>(default_leagues);
    const [allPlayers, setAllPlayers] = useState<Player[]>(createPlayers(100));

    useEffect(() => {
        for (let league of allLeagues) {
            let all_teams = league.teams;
            for (let team of all_teams) {
                let all_seekers = [...team.seekers.starters, ...team.seekers.backups];
                for (let seeker of all_seekers) {
                    if (seeker.team !== team) {
                        seeker.team = team;
                    }
                }

                let all_keepers = [...team.keepers.starters, ...team.keepers.backups];
                for (let keeper of all_keepers) {
                    if (keeper.team !== team) {
                        keeper.team = team;
                    }
                }

                let all_chasers = [...team.chasers.starters, ...team.chasers.backups];
                for (let chaser of all_chasers) {
                    if (chaser.team !== team) {
                        chaser.team = team;
                    }
                }

                let all_beaters = [...team.beaters.starters, ...team.beaters.backups];
                for (let beater of all_beaters) {
                    if (beater.team !== team) {
                        beater.team = team;
                    }
                }
            }
        }
    }, [allLeagues]);

    return (
        <MetadataContext.Provider
            value={{
                isMobile,
                awaitingResponse,
                setAwaitingResponse,

                allLeagues,
                setAllLeagues,
                allPlayers,
                setAllPlayers,
            }}
        >
            {children}
        </MetadataContext.Provider>
    );
}

// ----------------------------------------------------------------------

const default_leagues: League[] = [
    {
        id: 1,
        name: 'Premier League',
        teams: [
            {
                id: 1,
                name: 'Arsenal',
                stats: {
                    momentum: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    goals_scored: 0,
                    goals_allowed: 0,
                    snitch_scored: 0,
                    snitch_allowed: 0
                },
                seekers: {
                    starters: [],
                    backups: []
                },
                keepers: {
                    starters: [],
                    backups: []
                },
                chasers: {
                    starters: [],
                    backups: []
                },
                beaters: {
                    starters: [],
                    backups: []
                }
            },
            {
                id: 2,
                name: 'Aston Villa',
                stats: {
                    momentum: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    goals_scored: 0,
                    goals_allowed: 0,
                    snitch_scored: 0,
                    snitch_allowed: 0
                },
                seekers: {
                    starters: [],
                    backups: []
                },
                keepers: {
                    starters: [],
                    backups: []
                },
                chasers: {
                    starters: [],
                    backups: []
                },
                beaters: {
                    starters: [],
                    backups: []
                }
            },
            {
                id: 3,
                name: 'Average Team 1',
                stats: {
                    momentum: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    goals_scored: 0,
                    goals_allowed: 0,
                    snitch_scored: 0,
                    snitch_allowed: 0
                },
                seekers: {
                    starters: [createDefaultPlayer(75, 'Seeker')],
                    backups: [createDefaultPlayer(75, 'Seeker')]
                },
                keepers: {
                    starters: [createDefaultPlayer(75, 'Keeper')],
                    backups: [createDefaultPlayer(75, 'Keeper')]
                },
                chasers: {
                    starters: [createDefaultPlayer(75, 'Chaser'), createDefaultPlayer(75, 'Chaser'), createDefaultPlayer(75, 'Chaser')],
                    backups: [createDefaultPlayer(75, 'Chaser'), createDefaultPlayer(75, 'Chaser'), createDefaultPlayer(75, 'Chaser')]
                },
                beaters: {
                    starters: [createDefaultPlayer(75, 'Beater'), createDefaultPlayer(75, 'Beater')],
                    backups: [createDefaultPlayer(75, 'Beater'), createDefaultPlayer(75, 'Beater')]
                }
            },
            {
                id: 4,
                name: 'Average Team 2',
                stats: {
                    momentum: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    goals_scored: 0,
                    goals_allowed: 0,
                    snitch_scored: 0,
                    snitch_allowed: 0
                },
                seekers: {
                    starters: [createDefaultPlayer(75, 'Seeker')],
                    backups: [createDefaultPlayer(75, 'Seeker')]
                },
                keepers: {
                    starters: [createDefaultPlayer(75, 'Keeper')],
                    backups: [createDefaultPlayer(75, 'Keeper')]
                },
                chasers: {
                    starters: [createDefaultPlayer(75, 'Chaser'), createDefaultPlayer(75, 'Chaser'), createDefaultPlayer(75, 'Chaser')],
                    backups: [createDefaultPlayer(75, 'Chaser'), createDefaultPlayer(75, 'Chaser'), createDefaultPlayer(75, 'Chaser')]
                },
                beaters: {
                    starters: [createDefaultPlayer(75, 'Beater'), createDefaultPlayer(75, 'Beater')],
                    backups: [createDefaultPlayer(75, 'Beater'), createDefaultPlayer(75, 'Beater')]
                }
            },
            {
                id: 5,
                name: 'Good Team 1',
                stats: {
                    momentum: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    goals_scored: 0,
                    goals_allowed: 0,
                    snitch_scored: 0,
                    snitch_allowed: 0
                },
                seekers: {
                    starters: [createDefaultPlayer(85, 'Seeker')],
                    backups: [createDefaultPlayer(85, 'Seeker')]
                },
                keepers: {
                    starters: [createDefaultPlayer(85, 'Keeper')],
                    backups: [createDefaultPlayer(85, 'Keeper')]
                },
                chasers: {
                    starters: [createDefaultPlayer(85, 'Chaser'), createDefaultPlayer(85, 'Chaser'), createDefaultPlayer(85, 'Chaser')],
                    backups: [createDefaultPlayer(85, 'Chaser'), createDefaultPlayer(85, 'Chaser'), createDefaultPlayer(85, 'Chaser')]
                },
                beaters: {
                    starters: [createDefaultPlayer(85, 'Beater'), createDefaultPlayer(85, 'Beater')],
                    backups: [createDefaultPlayer(85, 'Beater'), createDefaultPlayer(85, 'Beater')]
                }
            },
            {
                id: 6,
                name: 'Good Team 2',
                stats: {
                    momentum: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    goals_scored: 0,
                    goals_allowed: 0,
                    snitch_scored: 0,
                    snitch_allowed: 0
                },
                seekers: {
                    starters: [createDefaultPlayer(85, 'Seeker')],
                    backups: [createDefaultPlayer(85, 'Seeker')]
                },
                keepers: {
                    starters: [createDefaultPlayer(85, 'Keeper')],
                    backups: [createDefaultPlayer(85, 'Keeper')]
                },
                chasers: {
                    starters: [createDefaultPlayer(85, 'Chaser'), createDefaultPlayer(85, 'Chaser'), createDefaultPlayer(85, 'Chaser')],
                    backups: [createDefaultPlayer(85, 'Chaser'), createDefaultPlayer(85, 'Chaser'), createDefaultPlayer(85, 'Chaser')]
                },
                beaters: {
                    starters: [createDefaultPlayer(85, 'Beater'), createDefaultPlayer(85, 'Beater')],
                    backups: [createDefaultPlayer(85, 'Beater'), createDefaultPlayer(85, 'Beater')]
                }
            },
            {
                id: 7,
                name: 'Excellent Team 1',
                stats: {
                    momentum: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    goals_scored: 0,
                    goals_allowed: 0,
                    snitch_scored: 0,
                    snitch_allowed: 0
                },
                seekers: {
                    starters: [createDefaultPlayer(95, 'Seeker')],
                    backups: [createDefaultPlayer(95, 'Seeker')]
                },
                keepers: {
                    starters: [createDefaultPlayer(95, 'Keeper')],
                    backups: [createDefaultPlayer(95, 'Keeper')]
                },
                chasers: {
                    starters: [createDefaultPlayer(95, 'Chaser'), createDefaultPlayer(95, 'Chaser'), createDefaultPlayer(95, 'Chaser')],
                    backups: [createDefaultPlayer(95, 'Chaser'), createDefaultPlayer(95, 'Chaser'), createDefaultPlayer(95, 'Chaser')]
                },
                beaters: {
                    starters: [createDefaultPlayer(95, 'Beater'), createDefaultPlayer(95, 'Beater')],
                    backups: [createDefaultPlayer(95, 'Beater'), createDefaultPlayer(95, 'Beater')]
                }
            },
            {
                id: 8,
                name: 'Excellent Team 2',
                stats: {
                    momentum: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    goals_scored: 0,
                    goals_allowed: 0,
                    snitch_scored: 0,
                    snitch_allowed: 0
                },
                seekers: {
                    starters: [createDefaultPlayer(95, 'Seeker')],
                    backups: [createDefaultPlayer(95, 'Seeker')]
                },
                keepers: {
                    starters: [createDefaultPlayer(95, 'Keeper')],
                    backups: [createDefaultPlayer(95, 'Keeper')]
                },
                chasers: {
                    starters: [createDefaultPlayer(95, 'Chaser'), createDefaultPlayer(95, 'Chaser'), createDefaultPlayer(95, 'Chaser')],
                    backups: [createDefaultPlayer(95, 'Chaser'), createDefaultPlayer(95, 'Chaser'), createDefaultPlayer(95, 'Chaser')]
                },
                beaters: {
                    starters: [createDefaultPlayer(95, 'Beater'), createDefaultPlayer(95, 'Beater')],
                    backups: [createDefaultPlayer(95, 'Beater'), createDefaultPlayer(95, 'Beater')]
                }
            },
        ]
    }
];

function createDefaultPlayer(stat_average: number, position: "Seeker" | "Keeper" | "Chaser" | "Beater"): Player {
    return {
        id: 0,
        first_name: 'Test',
        last_name: 'Player',
        position: position,
        team: '-',
        speed: stat_average,
        strength: stat_average,
        stamina: stat_average,
        tactics: stat_average,
        teamwork: stat_average,
        morale: stat_average,
        awareness: stat_average,
        shooting: stat_average,
        passing: stat_average,
        catching: stat_average,
        beating: stat_average,
        defense: stat_average,
        stats: {
            goals: 0,
            scoring_chances: 0,
            attacks: 0,
            stops: 0,
            snitch_catches: 0
        }
    }
}

function createPlayers(number_of_players: number = 5) {
    const first_names = [
        'Randy',
        'Stan',
        'Kyle',
        'Kenny',
        'Eric'
    ]
    const last_names = [
        'Marsh',
        'Broflovski',
        'McCormick',
        'Cartman',
        'Stotch'
    ]
    const positions = [
        'Chaser',
        'Beater',
        'Seeker',
        'Keeper'
    ]
    let players: Player[] = [];
    for (let i = 0; i < number_of_players; i++) {
        players.push({
            id: i,
            first_name: first_names[Math.floor(Math.random() * first_names.length)],
            last_name: last_names[Math.floor(Math.random() * last_names.length)],
            position: positions[Math.floor(Math.random() * positions.length)] as 'Chaser' | 'Beater' | 'Seeker' | 'Keeper',
            team: '-',
            speed: Math.floor(Math.random() * 50 + 50),
            strength: Math.floor(Math.random() * 50 + 50),
            stamina: Math.floor(Math.random() * 50 + 50),
            tactics: Math.floor(Math.random() * 50 + 50),
            teamwork: Math.floor(Math.random() * 50 + 50),
            morale: Math.floor(Math.random() * 50 + 50),
            awareness: Math.floor(Math.random() * 50 + 50),
            shooting: Math.floor(Math.random() * 50 + 50),
            passing: Math.floor(Math.random() * 50 + 50),
            catching: Math.floor(Math.random() * 50 + 50),
            beating: Math.floor(Math.random() * 50 + 50),
            defense: Math.floor(Math.random() * 50 + 50),
            stats: {
                goals: 0,
                scoring_chances: 0,
                attacks: 0,
                stops: 0,
                snitch_catches: 0
            }
        })
    }

    return players;
};