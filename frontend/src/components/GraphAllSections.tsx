import {
    Grid,
    Stack,
    Switch,
    Typography,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import { Team, TeamStats } from "src/@types/types";
import ReactApexChart from 'react-apexcharts';
import { fNumber, fShortenNumber } from "src/utils/formatNumber";

// ----------------------------------------------------------------------

type GraphAllSectionsProps = {
    homeTeam: Team,
    homeStats: TeamStats,
    awayTeam: Team,
    awayStats: TeamStats,
};

export default function GraphAllSections({ homeTeam, homeStats, awayTeam, awayStats }: GraphAllSectionsProps) {

    // const [showMomentumGraph, setShowMomentumGraph] = useState<boolean>(false);
    const [showScoreGraph, setShowScoreGraph] = useState<boolean>(true);
    const [showGoalsScoredGraph, setShowGoalsScoredGraph] = useState<boolean>(true);
    const [showSnitchesCaught, setShowSnitchesCaught] = useState<boolean>(true);
    const [showScoringChancesGraph, setShowScoringChancesGraph] = useState<boolean>(true);
    const [showAttacksGraph, setShowAttacksGraph] = useState<boolean>(true);
    const [showStopsGraph, setShowStopsGraph] = useState<boolean>(true);

    return (
        <Grid container spacing={2} alignItems={'center'} justifyContent={'center'} sx={{ width: '100%' }}>
            {/* <GraphSection
                title={'Momentum'}
                checked={showMomentumGraph}
                onToggle={() => { setShowMomentumGraph(!showMomentumGraph) }}
                data1={homeStats.momentum}
                dataLabel1={homeTeam.name}
                data2={awayStats.momentum}
                dataLabel2={awayTeam.name}
            /> */}
            <GraphSection
                title={'Score'}
                checked={showScoreGraph}
                onToggle={() => { setShowScoreGraph(!showScoreGraph) }}
                data1={calcScoreHistory(homeStats.goals_scored, homeStats.snitch_catches)}
                dataLabel1={homeTeam.name}
                data2={calcScoreHistory(awayStats.goals_scored, awayStats.snitch_catches)}
                dataLabel2={awayTeam.name}
            />
            <GraphSection
                title={'Goals Scored'}
                checked={showGoalsScoredGraph}
                onToggle={() => { setShowGoalsScoredGraph(!showGoalsScoredGraph) }}
                data1={homeStats.goals_scored}
                dataLabel1={homeTeam.name}
                data2={awayStats.goals_scored}
                dataLabel2={awayTeam.name}
            />
            <GraphSection
                title={'Snitches Caught'}
                checked={showSnitchesCaught}
                onToggle={() => { setShowSnitchesCaught(!showSnitchesCaught) }}
                data1={homeStats.snitch_catches}
                dataLabel1={homeTeam.name}
                data2={awayStats.snitch_catches}
                dataLabel2={awayTeam.name}
            />
            <GraphSection
                title={'Attacks'}
                checked={showAttacksGraph}
                onToggle={() => { setShowAttacksGraph(!showAttacksGraph) }}
                data1={homeStats.attacks}
                dataLabel1={homeTeam.name}
                data2={awayStats.attacks}
                dataLabel2={awayTeam.name}
            />
            <GraphSection
                title={'Scoring Chances'}
                checked={showScoringChancesGraph}
                onToggle={() => { setShowScoringChancesGraph(!showScoringChancesGraph) }}
                data1={homeStats.scoring_chances}
                dataLabel1={homeTeam.name}
                data2={awayStats.scoring_chances}
                dataLabel2={awayTeam.name}
            />
            <GraphSection
                title={'Stops'}
                checked={showStopsGraph}
                onToggle={() => { setShowStopsGraph(!showStopsGraph) }}
                data1={awayStats.opponent_stops}
                dataLabel1={homeTeam.name}
                data2={homeStats.opponent_stops}
                dataLabel2={awayTeam.name}
            />
        </Grid>
    )
};

// ----------------------------------------------------------------------

type GraphSectionProps = {
    title: string,
    checked: boolean,
    onToggle: () => void,
    data1: number[],
    dataLabel1: string,
    data2: number[],
    dataLabel2: string,
};

function GraphSection({ title, checked, onToggle, data1, dataLabel1, data2, dataLabel2 }: GraphSectionProps) {

    return (
        <Grid item xs={4}>
            <Stack spacing={1} alignItems={'center'} justifyContent={'flex-start'} sx={{ width: '100%' }} direction={'row'}>
                <Switch checked={checked} onChange={onToggle} />
                <Typography variant={'h6'}>{title}</Typography>
            </Stack>
            { checked &&
                <MomentumGraph
                    data1={data1}
                    dataLabel1={dataLabel1}
                    data2={data2}
                    dataLabel2={dataLabel2}
                />
            }
        </Grid>
    )
};

// ----------------------------------------------------------------------

type MomentumGraphProps = {
    data1: number[],
    dataLabel1: string,
    data2: number[],
    dataLabel2: string,
};

export function MomentumGraph({ data1, dataLabel1, data2, dataLabel2 }: MomentumGraphProps) {

    const theme = useTheme();
    
    const chartOptions = {
        colors: [theme.palette.primary.main, theme.palette.primary.lighter, theme.palette.primary.darker],
        markers: { size: 2 },
        stroke: { curve: "smooth" as "smooth" },
        noData: { text: 'Loading...' },
        chart: {
            toolbar: { show: false },
            sparkline: {
                enabled: false
                // set to true for a smaller, simpler chart
            },
            zoom: { enabled: false },
            stacked: false,
        },
        dataLabels: {
            enabled: false
            // set to true for the number to be present on the chart
        },
        grid: {
            position: 'front' as 'front',
            borderColor: theme.palette.text.secondary,
            xaxis: {
                lines: { show: false },
                tickPlacement: 'on' as 'on',
                labels: {
                    formatter: (value: number | string) => fShortenNumber(value),
                }
            },
        },
        yaxis: {
            labels: {
                show: true,
                formatter: (value: number | string) => fShortenNumber(value),
            }
        },
        xaxis: {
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { show: false }
        },
        legend: {
            show: true,
            position: 'top' as 'top',
            horizontalAlign: 'right' as 'right',
            floating: false,
        },
        tooltip: {
            enabled: true,
            // turn off the tooltip here
            x: {
                show: false,
            },
            y: {
                formatter: (seriesName: number | string) => fNumber(seriesName),
                title: {
                    formatter: (seriesName: number | string) => seriesName as string,
                },
            },
            marker: { show: false },
        },
    };

    return (
        <ReactApexChart
            type="line"
            series={[
                { data: data1, name: dataLabel1 },
                { data: data2, name: dataLabel2 },
            ]}
            options={{
                ...chartOptions,
                yaxis: {
                    labels: { formatter: (value: number | string) => fNumber(value) }
                },
                tooltip: {
                    theme: 'dark',
                    x: { show: false },
                    y: {
                        formatter: (seriesName: number | string) => fNumber(seriesName),
                    },
                    marker: { show: false },
                }
            }}
        />
    )
}

// ----------------------------------------------------------------------

function calcScoreHistory(goals_scored: number[], snitch_catches: number[]): number[] {
    if (goals_scored.length !== snitch_catches.length) {
        throw new Error('The lengths of the input arrays do not match');
    }

    let scoreHistory: number[] = [];
    let cumulativeScore = 0;

    for (let i = 0; i < goals_scored.length; i++) {
        cumulativeScore += goals_scored[i] * 10 + snitch_catches[i] * 30;
        scoreHistory.push(cumulativeScore);
    }
    return scoreHistory;
};