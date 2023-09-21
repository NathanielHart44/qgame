export function getStatColor(stat: number): string {
    if (stat < 45) {
        return '#CA1712';
    } else if (stat < 50) {
        return '#E45411';
    } else if (stat < 55) {
        return '#E46B11';
    } else if (stat < 59) {
        return '#E56B21';
    } else if (stat < 63) {
        return '#E47711';
    } else if (stat < 67) {
        return '#E49111';
    } else if (stat < 71) {
        return '#E4C111';
    } else if (stat < 75) {
        return '#D8DB15';
    } else if (stat < 79) {
        return '#AEC918';
    } else if (stat < 84) {
        return '#93C918';
    } else if (stat < 88) {
        return '#76C918';
    } else if (stat < 93) {
        return '#47B629';
    } else if (stat < 96) {
        return '#43A213';
    } else if (stat < 100) {
        return '#3C8A14';
    } else {
        return 'lightblue';
    }
}
