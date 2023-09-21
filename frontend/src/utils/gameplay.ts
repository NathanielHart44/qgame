import { Player, Team, TeamStats } from "src/@types/types";

// ----------------------------------------------------------------------

type gameplayProps = {
    gameCompletePercentage: number;
    minuteIncrement: number;
    homeTeam: Team;
    awayTeam: Team;
    homeStats: TeamStats;
    setHomeStats: (stats: TeamStats) => void;
    awayStats: TeamStats;
    setAwayStats: (stats: TeamStats) => void;
};

// ----------------------------------------------------------------------

const RAND_MODIFIER = 1.75; // higher number = more parity
const OFFENSE_MODIFIER = 0.5; // higher number = easier to score
const DEFENSE_MODIFIER = 0.3; // higher number = more stops
const BEATER_SNITCH_MODIFIER = 0.5; // higher number = harder to catch snitch
const SEEKER_DIFFICULTY_MODIFIER = 0.5; // higher number = harder to catch snitch
const STAMINA_MODIFIER = 1; // above 1 = stamina differential matters more, below 1 = stamina diff. matters less
const AVERAGE_ATTACKS_PER_MINUTE = 1;

// ----------------------------------------------------------------------

export default function gameplay(props: gameplayProps) {
    const { gameCompletePercentage, minuteIncrement, homeTeam, awayTeam, homeStats, setHomeStats, awayStats, setAwayStats } = props;
    const attacks_per_increment = Math.floor(AVERAGE_ATTACKS_PER_MINUTE * minuteIncrement);

    const calculateScoringStats = (team: Team, opp_team: Team, stats: TeamStats) => {
    
        let opponent_stops = 0;
        let all_attacks = 0;
        let scoring_chances = 0;
        let all_goals = 0;
        let all_snitch_catches = 0;

        let team_action_log = JSON.parse(JSON.stringify(stats.action_log));

        const calc_attacks = () => {
            let round_attacks = 0;
            let round_stops = 0;
            for (let i = 0; i < attacks_per_increment; i++) {
                const attacks_results = calcTotalAttacks(team.chasers.starters, team.keepers.starters[0], gameCompletePercentage);
                const stops_results = calcTotalStops(opp_team.chasers.starters, opp_team.keepers.starters[0], opp_team.beaters.starters, gameCompletePercentage);
                round_attacks += attacks_results[0] as number;
                round_stops += stops_results[0] as number;
                team_action_log.push(...attacks_results[1] as string[]);
                team_action_log.push(...stops_results[1] as string[]);
            }

            if (round_stops <= round_attacks) {
                all_attacks += (round_attacks - round_stops);
                opponent_stops += round_stops;
            } else {
                all_attacks += 0;
                opponent_stops += round_attacks;
            }
        };

        
        const calc_scoring_chances = () => {
            let successful_chances = 0;
            for (let i = 0; i < all_attacks; i++) {
                let combined_scoring_chance = 0;
                let scoring_chance_history = [];
                for (let j = 0; j < team.chasers.starters.length; j++) {
                    const player_chance = calcScoringChances(team.chasers.starters[j], gameCompletePercentage);
                    combined_scoring_chance += player_chance;
                    scoring_chance_history.push(
                        {
                            player: team.chasers.starters[j],
                            chance: player_chance
                        }
                        );
                        
                    }
                    combined_scoring_chance = combined_scoring_chance / 3;
                    const num_exceeding_scoring_mod = Math.floor((Math.random() * 100));
                    if (combined_scoring_chance > num_exceeding_scoring_mod) {
                        successful_chances += 1;
                        const highest_scoring_chance = scoring_chance_history.reduce((prev, current) => (prev.chance > current.chance) ? prev : current);
                        highest_scoring_chance.player.stats.scoring_chances += 1;
                        team_action_log.push(`${highest_scoring_chance.player.first_name} ${highest_scoring_chance.player.last_name} created a scoring chance`);
                    }
                }
                scoring_chances += successful_chances;
            };
            
            const calc_goals = () => {
                let successful_goals = 0;
                for (let i = 0; i < scoring_chances; i++) {
                    let combined_goal_chance = 0;
                    let goal_chance_history = [];
                    for (let j = 0; j < team.chasers.starters.length; j++) {
                        const player_chance = calcGoalsGen(team.chasers.starters[j], gameCompletePercentage);
                        combined_goal_chance += player_chance;
                        goal_chance_history.push(
                            {
                                player: team.chasers.starters[j],
                                chance: player_chance
                            }
                            );
                            
                        }
                        combined_goal_chance = combined_goal_chance / 3;
                        const num_exceeding_scoring_mod = Math.floor((Math.random() * 100));
                        if (combined_goal_chance > num_exceeding_scoring_mod) {
                            successful_goals += 1;
                            const highest_goal_chance = goal_chance_history.reduce((prev, current) => (prev.chance > current.chance) ? prev : current);
                            highest_goal_chance.player.stats.goals += 1;
                            team_action_log.push(`${highest_goal_chance.player.first_name} ${highest_goal_chance.player.last_name} scored a goal`);
                        }
                    }
                    all_goals += successful_goals;
            };

            const calc_snitch_catches = () => {
                const seeker_difficulty = 1 - (SEEKER_DIFFICULTY_MODIFIER - ((SEEKER_DIFFICULTY_MODIFIER * gameCompletePercentage) / 3));
                let seeker_catch_chance = seeker_difficulty * calcSeekerCatch(team.seekers.starters[0], gameCompletePercentage);
                const opp_beaters_stat = BEATER_SNITCH_MODIFIER * calcBeatersDefense(opp_team.beaters.starters[0], gameCompletePercentage);
                seeker_catch_chance -= opp_beaters_stat;

                const num_exceeding_scoring_mod = Math.floor((Math.random() * 100));
                if (seeker_catch_chance > num_exceeding_scoring_mod) {
                    all_snitch_catches += 1;
                    team.seekers.starters[0].stats.snitch_catches += 1;
                    team_action_log.push(`${team.seekers.starters[0].first_name} ${team.seekers.starters[0].last_name} caught the snitch`);
                }
            };
            
            calc_attacks();
            calc_scoring_chances();
            calc_goals();
            calc_snitch_catches();
            
            return {
                snitch_catches: all_snitch_catches,
                goals: all_goals,
                attacks: all_attacks,
                scoring_chances: scoring_chances,
                opponent_stops: opponent_stops,
                team_log: team_action_log,
            };
    };
      
    const home_scoring_stats = calculateScoringStats(
        homeTeam,
        awayTeam,
        homeStats,
    );

    const away_scoring_stats = calculateScoringStats(
        awayTeam,
        homeTeam,
        awayStats,
    );

    let home_stats = JSON.parse(JSON.stringify(homeStats));
    let away_stats = JSON.parse(JSON.stringify(awayStats));

    home_stats.score += home_scoring_stats.goals * 10;
    away_stats.score += away_scoring_stats.goals * 10;

    home_stats.snitch_catches.push(home_scoring_stats.snitch_catches);
    home_stats.score += home_scoring_stats.snitch_catches * 30;
    away_stats.snitch_catches.push(away_scoring_stats.snitch_catches);
    away_stats.score += away_scoring_stats.snitch_catches * 30;

    home_stats.goals_scored.push(home_scoring_stats.goals);
    away_stats.goals_scored.push(away_scoring_stats.goals);
    home_stats.scoring_chances.push(home_scoring_stats.scoring_chances);
    away_stats.scoring_chances.push(away_scoring_stats.scoring_chances);
    home_stats.attacks.push(home_scoring_stats.attacks);
    away_stats.attacks.push(away_scoring_stats.attacks);
    home_stats.opponent_stops.push(home_scoring_stats.opponent_stops);
    away_stats.opponent_stops.push(away_scoring_stats.opponent_stops);

    home_scoring_stats.team_log.push(`------Time: ${(gameCompletePercentage * 100).toFixed(0)}%------`);
    away_scoring_stats.team_log.push(`------Time: ${(gameCompletePercentage * 100).toFixed(0)}%------`);
    home_stats.action_log = home_scoring_stats.team_log;
    away_stats.action_log = away_scoring_stats.team_log;

    setHomeStats(home_stats);
    setAwayStats(away_stats);
};

// ----------------------------------------------------------------------

function calcStaminaModifier(gameCompletePercentage: number, staminaStat: number, normalStat: number) {
    return Math.floor(((normalStat * STAMINA_MODIFIER) - ((normalStat * gameCompletePercentage) * (1 - (staminaStat / 100)))) / STAMINA_MODIFIER);
};

function calcAttacks(player: Player, gameCompletePercentage: number) {
    let edited_combined_num = 0;
    if (player.position === 'Chaser') {
        let combined_num = 0;
        const speed = calcStaminaModifier(gameCompletePercentage, player.stamina, player.speed);
        const passing = calcStaminaModifier(gameCompletePercentage, player.stamina, player.passing);
        const tactics = calcStaminaModifier(gameCompletePercentage, player.stamina, player.tactics);
        combined_num = ((speed + passing + tactics)/3);
        edited_combined_num = (combined_num + 100) / 2;
    } else if (player.position === 'Keeper') {
        let combined_num = 0;
        const tactics = calcStaminaModifier(gameCompletePercentage, player.stamina, player.tactics);
        const teamwork = calcStaminaModifier(gameCompletePercentage, player.stamina, player.teamwork);
        const awareness = calcStaminaModifier(gameCompletePercentage, player.stamina, player.awareness);
        const passing = calcStaminaModifier(gameCompletePercentage, player.stamina, player.passing);
        combined_num = ((tactics + teamwork + awareness + passing)/4);
        edited_combined_num = (combined_num + 100) / 2;
    }
    return edited_combined_num;
}

// function combineRandomNums(num1: number) {
//     const rand_num = Math.floor(Math.random() * 100) * RAND_MODIFIER;
//     const add_or_subtract: boolean = Math.random() < 0.5;
//     let combined_num = num1;
//     if (add_or_subtract) { combined_num += rand_num }
//     else { combined_num -= rand_num };
//     return combined_num;
// }

function calcScoringChances(chaser: Player, gameCompletePercentage: number) {
    const passing = calcStaminaModifier(gameCompletePercentage, chaser.stamina, chaser.passing);
    const teamwork = calcStaminaModifier(gameCompletePercentage, chaser.stamina, chaser.teamwork);
    const awareness = calcStaminaModifier(gameCompletePercentage, chaser.stamina, chaser.awareness);

    const combined_stats_average = ((passing + teamwork + awareness)/3);
    const edited_combined_average = (combined_stats_average + 100) / 2;
    return edited_combined_average;
}

function calcGoalsGen(chaser: Player, gameCompletePercentage: number) {
    const shooting = calcStaminaModifier(gameCompletePercentage, chaser.stamina, chaser.shooting);
    const teamwork = calcStaminaModifier(gameCompletePercentage, chaser.stamina, chaser.teamwork);

    const combined_stats_average = ((shooting + teamwork)/2);
    const edited_combined_average = (combined_stats_average + 100) / 2;
    return edited_combined_average;
}

function calcChaserDefense(chaser: Player, gameCompletePercentage: number) {
    const speed = calcStaminaModifier(gameCompletePercentage, chaser.stamina, chaser.speed);
    const strength = calcStaminaModifier(gameCompletePercentage, chaser.stamina, chaser.strength);
    const defense = calcStaminaModifier(gameCompletePercentage, chaser.stamina, chaser.defense);
    const awareness = calcStaminaModifier(gameCompletePercentage, chaser.stamina, chaser.awareness);

    const combined_stats_average = ((speed + strength + defense + awareness)/4);
    const edited_combined_average = (combined_stats_average + 100) / 2;
    return edited_combined_average;
}

function calcBeatersDefense(beater: Player, gameCompletePercentage: number) {
    const speed = calcStaminaModifier(gameCompletePercentage, beater.stamina, beater.speed);
    const strength = calcStaminaModifier(gameCompletePercentage, beater.stamina, beater.strength);
    const defense = calcStaminaModifier(gameCompletePercentage, beater.stamina, beater.defense);
    const awareness = calcStaminaModifier(gameCompletePercentage, beater.stamina, beater.awareness);
    const beating = calcStaminaModifier(gameCompletePercentage, beater.stamina, beater.beating);
    const tactics = calcStaminaModifier(gameCompletePercentage, beater.stamina, beater.tactics);
    const teamwork = calcStaminaModifier(gameCompletePercentage, beater.stamina, beater.teamwork);

    const combined_stats_average = ((speed + strength + defense + awareness + beating + tactics + teamwork)/7);
    const edited_combined_average = (combined_stats_average + 100) / 2;
    return edited_combined_average;
}

function calcKeeperDefense(keeper: Player, gameCompletePercentage: number) {
    const speed = calcStaminaModifier(gameCompletePercentage, keeper.stamina, keeper.speed);
    const strength = calcStaminaModifier(gameCompletePercentage, keeper.stamina, keeper.strength);
    const defense = calcStaminaModifier(gameCompletePercentage, keeper.stamina, keeper.defense);
    const awareness = calcStaminaModifier(gameCompletePercentage, keeper.stamina, keeper.awareness);
    
    const combined_stats_average = ((speed + strength + defense + awareness)/4);
    const edited_combined_average = (combined_stats_average + 100) / 2;
    return edited_combined_average;
}

function calcSeekerCatch(seeker: Player, gameCompletePercentage: number) {
    const speed = calcStaminaModifier(gameCompletePercentage, seeker.stamina, seeker.speed);
    const stamina = calcStaminaModifier(gameCompletePercentage, seeker.stamina, seeker.stamina);
    const awareness = calcStaminaModifier(gameCompletePercentage, seeker.stamina, seeker.awareness);
    const tactics = calcStaminaModifier(gameCompletePercentage, seeker.stamina, seeker.tactics);
    const catching = calcStaminaModifier(gameCompletePercentage, seeker.stamina, seeker.catching);

    const combined_stats_average = (((speed * 2) + (catching * 2) + stamina + awareness + tactics)/7);
    const edited_combined_average = (combined_stats_average + 100) / 2;
    return edited_combined_average;
}

// ----------------------------------------------------------------------

function calcTotalAttacks(chasers: Player[], keeper: Player, gameCompletePercentage: number) {
    const all_players = [...chasers, keeper];
    let total_attacks = 0;
    let action_log = [];

    const thresholdMappings = [
        { threshold: 90, attackValue: 1.25 },
        { threshold: 80, attackValue: 1.0 },
        { threshold: 70, attackValue: 0.75 },
        { threshold: 60, attackValue: 0.50 },
        { threshold: 50, attackValue: 0.25 },
        { threshold: 40, attackValue: 0.0 },
        { threshold: 30, attackValue: -0.25 },
        { threshold: 20, attackValue: -0.5 },
        { threshold: 10, attackValue: -1.0 },
        { threshold: -Infinity, attackValue: -1.5 },
    ];

    for (let player of all_players) {
        const player_calc_stats = calcAttacks(player, gameCompletePercentage);
        const random_mod = (Math.random() * 100) * RAND_MODIFIER * (Math.random() < OFFENSE_MODIFIER ? 1 : -1);
        const player_combined_stats = Math.floor(player_calc_stats + random_mod);
        
        let attackMapping = thresholdMappings.find(mapping => player_combined_stats >= mapping.threshold);
        let attacks = attackMapping !== undefined ? attackMapping.attackValue : -0.5;

        total_attacks += attacks;
        const attackFloorValue = Math.floor(attacks);
        if (attackFloorValue > 0) {
            player.stats.attacks += attackFloorValue;
            action_log.push(`${player.first_name} ${player.last_name} had ${attackFloorValue} attacks`);
        }
    }
    return [Math.max(0, Math.floor(total_attacks)), action_log];
}

function calcTotalStops(opp_chasers: Player[], opp_keeper: Player, opp_beaters: Player[], gameCompletePercentage: number) {
    const all_players = [...opp_chasers, opp_keeper, ...opp_beaters];
    let all_stops = 0;
    let action_log = [];

    const STAT_THRESHOLDS = [95, 90, 80, 70, 60];
    const STOPS_THRESHOLDS = [1, 0.75, 0.5, 0.25, -0.25];

    for (let player of all_players) {
        const player_calc_stats = getPlayerCombinedStats(player, gameCompletePercentage);
        const random_mod = (Math.random() * 100) * RAND_MODIFIER * (Math.random() < DEFENSE_MODIFIER ? 1 : -1);
        const player_combined_stats = player_calc_stats + random_mod;

        let stops = STOPS_THRESHOLDS[STAT_THRESHOLDS.findIndex(threshold => player_combined_stats >= threshold)] || 0;
        
        all_stops += stops;
        const stopsFloorValue = Math.floor(stops);
        if (stopsFloorValue > 0) {
            player.stats.stops += stopsFloorValue;
            action_log.push(`${player.first_name} ${player.last_name} had ${stopsFloorValue} stops`);
        }
    }
    return [Math.floor(all_stops), action_log];
}

function getPlayerCombinedStats(player: Player, gameCompletePercentage: number) {
    switch (player.position) {
        case 'Keeper':
            return calcKeeperDefense(player, gameCompletePercentage);
        case 'Beater':
            return calcBeatersDefense(player, gameCompletePercentage);
        default:
            return calcChaserDefense(player, gameCompletePercentage);
    }
}