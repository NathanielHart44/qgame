export type Player = {
    id: number;
    first_name: string;
    last_name: string;
    position: 'Seeker' | 'Keeper' | 'Chaser' | 'Beater';
    team: Team | '-';
    speed: number;
    strength: number;
    stamina: number;
    tactics: number;
    teamwork: number;
    morale: number;
    awareness: number;
    shooting: number;
    passing: number;
    catching: number;
    beating: number;
    defense: number;
    stats: {
        goals: number;
        scoring_chances: number;
        attacks: number;
        stops: number;
        snitch_catches: number;
    };
};

export type PlayerSort = {
    id: 'asc' | 'desc' | null;
    first_name: 'asc' | 'desc' | null;
    last_name: 'asc' | 'desc' | null;
    team_name: 'asc' | 'desc' | null;
    position: 'asc' | 'desc' | null;
    speed: 'asc' | 'desc' | null;
    strength: 'asc' | 'desc' | null;
    stamina: 'asc' | 'desc' | null;
    tactics: 'asc' | 'desc' | null;
    teamwork: 'asc' | 'desc' | null;
    morale: 'asc' | 'desc' | null;
    awareness: 'asc' | 'desc' | null;
    shooting: 'asc' | 'desc' | null;
    passing: 'asc' | 'desc' | null;
    catching: 'asc' | 'desc' | null;
    beating: 'asc' | 'desc' | null;
    defense: 'asc' | 'desc' | null;
};

export type Team = {
    id: number;
    name: string;
    stats: {
        momentum: number;
        wins: number;
        losses: number;
        draws: number;
        goals_scored: number;
        goals_allowed: number;
        snitch_scored: number;
        snitch_allowed: number;
    }
    seekers: PositionDepth,
    keepers: PositionDepth,
    chasers: PositionDepth,
    beaters: PositionDepth
};

export type TeamStats = {
    momentum: number[];
    snitch_catches: number[];
    score: number;
    goals_scored: number[];
    scoring_chances: number[];
    attacks: number[];
    opponent_stops: number[];
    action_log: string[];
};

export type PositionDepth = {
    starters: Player[];
    backups: Player[];
};

export type League = {
    id: number,
    name: string,
    teams: Team[],
};