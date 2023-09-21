function formatAMPM(date: Date) {
    let hours = date.getHours();
    let minutes = date.getMinutes().toString();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours || 12;
    minutes = parseInt(minutes) < 10 ? `0${minutes}` : minutes;
    const beautifiedTime = `${hours}:${minutes} ${ampm}`;
    return beautifiedTime;
  }
  export const dateFormateHandler = (date: Date) => {
    const newDate = new Date(date);
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const time = formatAMPM(newDate);
    const hours12 = newDate.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      hour12: true,
    });
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    const seconds = newDate.getSeconds();
    const dayName = days[newDate.getDay()];
    const dateNumber = `0${newDate.getDate()}`.slice(-2);
    const monthName = months[newDate.getMonth()];
    const monthNumber = `0${newDate.getMonth() + 1}`.slice(-2);
    const fullYear = newDate.getFullYear();
    const standardDate = `${dateNumber}-${monthNumber}-${fullYear}`;
    const dateAndTime = `${dateNumber}-${monthNumber}-${fullYear}T${hours}:${minutes}:${seconds}`;
    return {
      standardDate,
      dateAndTime,
      time,
      hours: hours.toString().length === 1 ? `0${hours}` : hours,
      minutes: minutes.toString().length === 1 ? `0${minutes}` : minutes,
      seconds,
      hours12,
      dayName,
      dateNumber,
      monthName,
      monthNumber,
      fullYear,
    };
  };
