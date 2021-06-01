import * as moment from 'moment';
import * as functions from 'firebase-functions';
import { BLANK } from '.';

export const DAY_ABBREVIATED = ['Sun', 'M', 'T', 'W', 'Th', 'F', 'Sat'];
export const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const PST_OFFSET = 8;

export type DateRange = { fromDate: Date; toDate: Date };
export const dateFormatISO8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

export const dateToStr = (date: Date) => {
  try {
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const strToDate = (date: string) => {
  try {
    const result = /(\d+)\/(\d+)\/(\d+)/.exec(date);
    if (!result) {
      throw new Error('The provided date is invalid. It should be in the mm/dd/yyyy format.');
    } else {
      const [, month, day, year] = result;
      const dateFormat = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (dateFormat.toString() === 'Invalid Date')
        throw new Error('The provided toDate is invalid. It should be in the mm/dd/yyyy format.');
      return dateFormat;
    }
  } catch (e) {
    console.error(e);
    return e;
  }
};

const now = new Date();
export const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
export const getCurrentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
// moment().clone().startOf('month').format('YYYY-MM-DD hh:mm');

export const serviceStartDate = new Date(
  now.getFullYear() - 1,
  now.getMonth() - 6,
  now.getDay() - 30 + 1,
  now.getDate(),
);

export const formatDate = (date: Date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

export const formatDateWithDivider = (date: Date, divider: string = '/') => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join(divider);
};

export const compactLoggingDateTime = () => {
  const hours = ('0' + now.getHours()).slice(-2); // 0-23
  const minutes = ('0' + now.getMinutes()).slice(-2); // 0-59
  const seconds = ('0' + now.getSeconds()).slice(-2);
  const ms = '0' + now.getMilliseconds(); //.slice(-2);
  return `[${eightCharDate(new Date())}:${hours}h:${minutes}m:${seconds}s:${ms}ms]`;
};

export const compactLoggingTime = () => {
  try {
    const hours = ('0' + now.getHours()).slice(-2); // 0-23
    const minutes = ('0' + now.getMinutes()).slice(-2); // 0-59
    const seconds = ('0' + now.getSeconds()).slice(-2);
    const ms = '0' + now.getMilliseconds(); //.slice(-2);
    return `[${hours}h:${minutes}m:${seconds}s:${ms}ms]`;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const eightCharDate = (date: Date) => {
  try {
    return moment(date).format('YYYYMMDD').toString();
  } catch (e) { functions.logger.error(e); return e; }
};

export const isDate = (dateStr: string) => {
  return !isNaN(new Date(dateStr).getDate());
}

export const parseDate = (date: string) => {
  const dateFormat = 'YYYYMMDD-hhmmssSSS';
  if (date.length > dateFormat.length) {
    functions.logger.warn(`${date} contains ${date.length} ` +
      `characters which exceed ${dateFormat} which has ${dateFormat.length}.`);
    return undefined;
  }
  const fmt = dateFormat.substring(0, date.length);
  return moment(date, fmt).toDate();
};

export const twelveCharDate = (date: Date) => {
  let monthPad: boolean = false,
    dayPad: boolean = false,
    hourPad: boolean = false;
  if ((date.getMonth() + 1).toString().length === 1) monthPad = true;
  if ((date.getDate() + 1).toString().length === 1) dayPad = true;
  if ((date.getHours() + 1).toString().length === 1) hourPad = true;

  return (
    `${date.getFullYear()}` +
    `${monthPad ? 0 : BLANK}` +
    `${date.getMonth() + 1}` +
    `${dayPad ? 0 : BLANK}` +
    `${date.getDate()}` +
    `${hourPad ? 0 : BLANK}` +
    `${date.getHours()}`
  ).toString();
};

export const compactDateTime = (date: Date) => {
  let monthPad: boolean = false,
    dayPad: boolean = false,
    hourPad: boolean = false,
    minutePad: boolean = false,
    secondPad: boolean = false,
    millisecPad: boolean = false;
  if ((date.getMonth() + 1).toString().length === 1) monthPad = true;
  if ((date.getDate() + 1).toString().length === 1) dayPad = true;
  if ((date.getHours() + 1).toString().length === 1) hourPad = true;
  if ((date.getMinutes() + 1).toString().length === 1) minutePad = true;
  if ((date.getSeconds() + 1).toString().length === 1) secondPad = true;
  if ((date.getMilliseconds() + 1).toString().length === 1) millisecPad = true;

  return (
    `${date.getFullYear()}` +
    `${monthPad ? 0 : BLANK}` +
    `${date.getMonth() + 1}` +
    `${dayPad ? 0 : BLANK}` +
    `${date.getDate()}` +
    `-` +
    `${hourPad ? 0 : BLANK}` +
    `${date.getHours()}` +
    `${minutePad ? 0 : BLANK}` +
    `${date.getMinutes()}` +
    `${secondPad ? 0 : BLANK}` +
    `${date.getSeconds()}` +
    `${millisecPad ? 0 : BLANK}` +
    `${date.getMilliseconds().toString().slice(-2)}`
  ).toString();
};

export const compactTimeStamp = (date: Date) => {
  return moment(date).format('YYYYMMDD-hh:mm:ss:SS').toString();
};

// disabled for moment version 
export const compactTimeStampManual = (date: Date) => {
  let monthPad: boolean = false,
    dayPad: boolean = false,
    hourPad: boolean = false,
    minutePad: boolean = false,
    secondPad: boolean = false,
    millisecPad: boolean = false;
  if ((date.getMonth() + 1).toString().length === 1) monthPad = true;
  if ((date.getDate() + 1).toString().length === 1) dayPad = true;
  if ((date.getHours() + 1).toString().length === 1) hourPad = true;
  if ((date.getMinutes() + 1).toString().length === 1) minutePad = true;
  if ((date.getSeconds() + 1).toString().length === 1) secondPad = true;
  if ((date.getMilliseconds() + 1).toString().length === 1) millisecPad = true;

  return (
    `${date.getFullYear()}` +
    `${monthPad ? 0 : BLANK}` +
    `${date.getMonth() + 1}` +
    `${dayPad ? 0 : BLANK}` + // FIXME: 2021039 => fails to detect 9th day single digit
    `${date.getDate()}` +
    `-` +
    `${hourPad ? 0 : BLANK}` +
    `${date.getHours()}` +
    `:` +
    `${minutePad ? 0 : BLANK}` +
    `${date.getMinutes()}` +
    `:` +
    `${secondPad ? 0 : BLANK}` +
    `${date.getSeconds()}` +
    `:` +
    `${millisecPad ? 0 : BLANK}` +
    `${date.getMilliseconds().toString().slice(-2)}`
  ).toString(); // 202101012359010111
};

export const sixteenCharDate = (date: Date) => {
  let monthPad: boolean = false,
    dayPad: boolean = false,
    hourPad: boolean = false,
    minutePad: boolean = false,
    secondPad: boolean = false,
    millisecPad: boolean = false;
  if ((date.getMonth() + 1).toString().length === 1) monthPad = true;
  if ((date.getDate() + 1).toString().length === 1) dayPad = true;
  if ((date.getHours() + 1).toString().length === 1) hourPad = true;
  if ((date.getMinutes() + 1).toString().length === 1) minutePad = true;
  if ((date.getSeconds() + 1).toString().length === 1) secondPad = true;
  if ((date.getMilliseconds() + 1).toString().length === 1) millisecPad = true;

  return (
    `${date.getFullYear()}` +
    `${monthPad ? 0 : BLANK}` +
    `${date.getMonth() + 1}` +
    `${dayPad ? 0 : BLANK}` +
    `${date.getDate()}` +
    `${hourPad ? 0 : BLANK}` +
    `${date.getHours()}` +
    `${minutePad ? 0 : BLANK}` +
    `${date.getMinutes()}` +
    `${secondPad ? 0 : BLANK}` +
    `${date.getSeconds()}` +
    `${millisecPad ? 0 : BLANK}` +
    `${date.getMilliseconds().toString().slice(-2)}`
  ).toString(); // 202101012359010111
};

export const convertUTCDateToLocalDate = (date: Date) => {
  const localtime = new Date(date.getTime() + PST_OFFSET * 60 * 1000);
  const offset = date.getTimezoneOffset() / 60;
  const hours = date.getHours();
  localtime.setHours(hours - offset);
  return localtime;
};

const checkValueLength = (value: string) => {
  if (value.length < 2) return '0' + value.toString();
  return value.toString();
};

// preferred formating for Slack
export const formatDateTime = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = checkValueLength(`${d.getMonth() + 1}`);
  const day = checkValueLength(`${d.getDate()}`);
  const hours = checkValueLength(`${d.getHours()}`);
  const mins = checkValueLength(`${d.getMinutes()}`);
  const seconds = checkValueLength(`${d.getSeconds()}`);
  const milliseconds = checkValueLength(`${d.getMilliseconds()}`);
  const finalTime = [hours, mins, seconds, milliseconds].join(':');
  const finalDate = [year, month, day].join('-');
  return `${finalDate}-${finalTime}`;
};

export const DEFAULT_START_DATE = new Date(now.getFullYear(), now.getMonth(), now.getDay() - 30 + 1, now.getDate());
export const TWO_YEARS_AGO_DATE = new Date(moment().subtract(2, 'year').format('MM-DD-YYYY'));
export const ONE_YEAR_AGO_DATE = new Date(moment().subtract(1, 'year').format('MM-DD-YYYY'));
export const TWO_MONTHS_AGO_DATE = new Date(moment().subtract(2, 'months').format('MM-DD-YYYY'));
export const ONE_MONTH_AGO_DATE = new Date(moment().subtract(1, 'months').format('MM-DD-YYYY'));
export const THREE_WEEKS_AGO_DATE = new Date(moment().subtract(3, 'weeks').format('MM-DD-YYYY'));
export const FORTNIGHT_DATE = new Date(moment().subtract(2, 'weeks').format('MM-DD-YYYY'));
export const LAST_WEEK_DATE = new Date(moment().subtract(1, 'week').format('MM-DD-YYYY'));
export const TEN_DAYS_AGO_DATE = new Date(moment().subtract(10, 'day').format('MM-DD-YYYY'));
export const THREE_DAYS_AGO_DATE = new Date(moment().subtract(3, 'day').format('MM-DD-YYYY'));
export const YESTERDAY_DATE = new Date(moment().subtract(1, 'day').format('MM-DD-YYYY'));
export const TODAY_DATE = new Date();

export const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDay() - 30 + 1, now.getDate());
export const twoYearsAgoDate = new Date(moment().subtract(2, 'year').format('MM-DD-YYYY'));
export const twoMonthsAgoStartDate = new Date(moment().subtract(2, 'months').format('MM-DD-YYYY'));
export const oneMonthAgoStartDate = new Date(moment().subtract(1, 'months').format('MM-DD-YYYY'));
export const threeWeeksAgoStartDate = new Date(moment().subtract(3, 'weeks').format('MM-DD-YYYY'));
export const fortnightStartDate = new Date(moment().subtract(2, 'weeks').format('MM-DD-YYYY'));
export const lastWeekStartDate = new Date(moment().subtract(1, 'week').format('MM-DD-YYYY'));
export const threeDaysAgoDate = new Date(moment().subtract(3, 'day').format('MM-DD-YYYY'));
export const yesterdayStartDate = new Date(moment().subtract(1, 'day').format('MM-DD-YYYY'));
export const todayStartDate = new Date();

export const FROM_DATE = fortnightStartDate;
export const TO_DATE = yesterdayStartDate;

export const isWeekend = (day: number) => {
  if (day === 0 || day >= 6) return true;
  return false;
};

export const isOfficeHours = (hour: number) => {
  if (hour >= 9 && hour <= 17) return true;
  return false;
};

export const getMonthDateRange = (dateRange: { fromDate: string; toDate: string }) => {
  try {
    const from = new Date(dateRange.fromDate);
    const to = new Date(dateRange.toDate);
    const INCLUSIVE = 1;
    const TOTAL_MONTH_OF_THE_YEAR = 12;
    const alldate: Date[] = [];
    const fromMonth = from.getMonth();
    const fromYear = from.getFullYear();
    const toMonth = to.getMonth();
    const toYear = to.getFullYear();
    const yearDifference = (toYear - fromYear) * TOTAL_MONTH_OF_THE_YEAR;
    const monthDifference = toMonth + yearDifference - fromMonth;
    if (monthDifference === 0) alldate.push(new Date(fromYear, fromMonth));
    let count = 0;
    for (let i = 0; i < monthDifference + INCLUSIVE; i++) {
      const newMonth = fromMonth + count;
      alldate.push(new Date(fromYear, newMonth));
      count++;
    }
    return alldate;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const getDaysDateRange = (dateRange: { fromDate: string | Date; toDate: string | Date }) => {
  try {
    const from = typeof dateRange.fromDate !== 'string' ? dateRange.fromDate : new Date(dateRange.fromDate);
    const to = typeof dateRange.toDate !== 'string' ? dateRange.toDate : new Date(dateRange.toDate);

    // console.log(`${from} => ${to}`);
    const TOTAL_MONTH_OF_THE_YEAR = 12;
    const APPROXIMATE_DAYS_OF_THE_MONTH = 28;
    const alldate: Date[] = [];
    const INCLUSIVE = 1;
    const fromDay = from.getUTCDate();
    const fromMonth = from.getUTCMonth();
    const fromYear = from.getUTCFullYear();
    const toMonth = to.getUTCMonth();
    const toYear = to.getUTCFullYear();
    const toDay = to.getUTCDate();
    const hrs = 24 - 8;
    const yearDifference = (toYear - fromYear) * TOTAL_MONTH_OF_THE_YEAR;
    const monthDifference = (toMonth + yearDifference - fromMonth) * APPROXIMATE_DAYS_OF_THE_MONTH;
    const dayDifference = toDay + monthDifference - fromDay;

    // console.log(to, from, dayDifference, toDay, fromDay, monthDifference, yearDifference, hrs, "difference");
    if (dayDifference <= 0) return alldate.push(new Date(toYear, toMonth, toDay));

    let count = -1;
    for (let i = 0; i < dayDifference + INCLUSIVE; i++) {
      const newDay = fromDay + count;
      alldate.push(new Date(fromYear, fromMonth, newDay, hrs));
      count++;
    }
    return alldate;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const makeTime = (firebaseTimestamp: { _seconds: number; _nanoseconds: number }): Date | null => {
  if (!firebaseTimestamp || !firebaseTimestamp._seconds) return null;
  return new Date(firebaseTimestamp._seconds * 1000);
};

export const dateInPast = (firstDate: Date, secondDate: Date) => {
  return new Date(firstDate) > new Date(secondDate); // true if time1 is later
};

// ISO 8601
export function getWeekNumber(year: number, month: number, dDate: number) {
  const newDate = new Date(year, month, dDate);
  const date = newDate.getDate();
  const day = newDate.getDay();
  // process.stdout.write(`${newDate.toDateString()} => dayDate:${date}, day of week:${day} to week no. =>`);
  const Q = (date + day) / 7;
  const R = (date + day) % 7;
  if (R !== 0) {
    // process.stdout.write(`${Math.floor(Q)}\n`);
    return Math.floor(Q);
  } else {
    // process.stdout.write(`${Q}\n`);
    return Q;
  }
}
// https://en.wikipedia.org/wiki/Federal_holidays_in_the_United_States
export const holidays = {
  // keys are formatted as month,week,day
  '0,1,1': 'New Years Day',
  '0,3,15': 'Martin Luther King, Jr. Day',
  '1,4,22': "Washington's Birthday",
  '1,2,1': "President's Day",
  '6,4,30': 'Memorial Day',
  '7,1,4': 'Independance Day',
  '8,1,7': 'Labor Day', // First Monday in September
  '10,2,11': "Veteran's Day",
  '9,2,14': 'Columbus Day', // Second Monday in October
  '10,3,28': 'Thanksgiving Day', // Fourth Thursday of November
  '11,4,25': 'Christmas Day',
  '11,4,31': 'New Years Eve',
};

export const floatingHolidays = {
  // month, count/week, day
  '0,3,1': 'Martin Luther King, Jr. Day', // 3rd Monday of January
  '4,4,1': 'Memorial Day', // Last Monday in May
  '8,1,1': 'Labor Day', // First Monday in September
  '9,2,1': 'Columbus Day', // 2nd Monday in October
  '10,4,5': 'Thanksgiving Day',
};

export const shiftForHoliday =
  (year: number, month: number, week: number, date: number) => {
    const checkDate = new Date(year, month, date);
    const holidayDate = `${checkDate.getMonth()},${week},${checkDate.getDate()}`;

    if (holidays[holidayDate] || floatingHolidays[holidayDate]) {
      // process.stdout.write(`${holidays[holidayDate]}, Holiday match, adjusting by a day.\n`);
      const adjustedDate = date + 1;
      shiftForHoliday(year, month, week, adjustedDate);
      return { m: month, w: week, d: adjustedDate };
    }
    // console.log('Not an Holiday...');
    return { m: month, w: week, d: date };
  };

const businessHours = { start: 12, end: 18 };

export const getNextBusinessSlot = (date: Date) => {
  // process.stdout.write(`Getting next business timeslot, analyzing current time: ${date.toString()}. `);
  let newTimeSlot = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const dayDate = date.getDate();
  const day = date.getDay();
  const hrs = date.getHours();

  if (!isWeekend(day)) {
    // process.stdout.write(`Weekday, `);
    if (hrs >= businessHours.start && hrs <= businessHours.end) {
      // process.stdout.write(`during business hours.\n`);
      const week = getWeekNumber(year, month, dayDate);
      const { m, d } = shiftForHoliday(year, month, week, dayDate);
      newTimeSlot = new Date(year, m, d, hrs + 1);
    } else {
      // process.stdout.write(`outside of business hours.\n`);
      const adjustedDay = day + 1;
      if (isWeekend(adjustedDay)) {
        // process.stdout.write(`Weekend, checking if shifting day to Friday is sufficient,  move to Monday.\n`);
        const nDate = dayDate + 3;
        const week = getWeekNumber(year, month, nDate);
        const { m, d } = shiftForHoliday(year, month, week, nDate);
        newTimeSlot = new Date(year, m, d, businessHours.start);
      } else {
        // process.stdout.write(`New weekday, checking for holiday.\n`);
        const week = getWeekNumber(year, month, dayDate);
        const { m, d } = shiftForHoliday(year, month, week, dayDate);
        newTimeSlot = new Date(year, m, d, businessHours.start);
      }
    }
    //return newTimeSlot;
  } else if (isWeekend(day)) {
    // process.stdout.write(`Weekend, `);
    const SATURDAY = 6;
    const SUNDAY = 0;
    if (day === SATURDAY) {
      // process.stdout.write(`Saturday, jump to Monday (2 days).\n`);
      const stDay = dayDate + 2;
      const week = getWeekNumber(year, month, stDay);
      const { m, d } = shiftForHoliday(year, month, week, stDay);
      newTimeSlot = new Date(year, m, d, businessHours.start);
    } else if (day === SUNDAY) {
      // process.stdout.write(`Sunday, jumping to Monday (1 day).\n`);
      const snDay = dayDate + 1;
      const week = getWeekNumber(year, month, snDay);
      const { m, d } = shiftForHoliday(year, month, week, snDay);
      newTimeSlot = new Date(year, m, d, businessHours.start);
    }
  }
  return newTimeSlot;
};

export const incrementTime = (timestamp: Date = new Date(), seconds: number = 60) => {
  const convertMinutes = seconds / 60;
  const updateTimestamp = timestamp;
  return moment(updateTimestamp).add(convertMinutes, 'm').toDate();
};

export const addMinutesToDate = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};
