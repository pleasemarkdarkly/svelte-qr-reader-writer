import {
  FgGreen as G,
  FgRed as Rd,
  FgCyan as Cy,
  Reset as R,
  FgYellow as Y,
  Underscore as _,
  FROM_DATE,
  TO_DATE,
  formatDate,
  formatDateWithDivider,
  getRandomInt,
  dateToStr,
  dateToWords,
  threeDaysAgoDate,
  yesterdayStartDate,
  getMonthDateRange,
  defaultStartDate,
  fortnightStartDate,
  lastWeekStartDate,
  compactLoggingTime,
  eightCharDate,
  formatDateTime,
  convertUTCDateToLocalDate,
  randomAlphanumeric,
  isWeekend,
  isOfficeHours,
  sixteenCharDate,
  getDaysDateRange,
  getNextBusinessSlot,
  shiftForHoliday,
  getWeekNumber,
  compactDateTime,
  parseDate,
} from '.';
import * as moment from 'moment';

// const extratime = '00:00:00 GMT-0800';

const TestAutoDates = () => {
  process.stdout.write(`${Cy}Pre-computed date/times for functions${R}\n`);
  process.stdout.write(
    // eslint-disable-next-line max-len
    `${Y}defaultStartDate:${defaultStartDate}, \n` +
    `fortNightStartDate:${fortnightStartDate}, \n` +
    `lastWeekStartDate:${lastWeekStartDate}, \n` +
    `threeDaysAgo:${threeDaysAgoDate}, \n` +
    `yesterday:${yesterdayStartDate}${R}\n`,
  );
  process.stdout.write(`\n`);
};

const TestDateRanges = () => {
  process.stdout.write(`${Cy}Date range for accounting functions${R}\n`);
  process.stdout.write(
    `Two dates as arguments, function returns the first day of each month between the aforementioned dates.\n`,
  );
  const dateRange = { fromDate: dateToStr(defaultStartDate), toDate: dateToStr(TO_DATE) };
  process.stdout.write(`dateRange:${JSON.stringify(dateRange)}\n`);
  process.stdout.write(`${getMonthDateRange(dateRange)}\n`);
  process.stdout.write(`\n`);
};

const TestTimestampFormats = () => {
  process.stdout.write(`${Cy}Convert timestamp from string/date${R}\n`);
  process.stdout.write(
    `fromDate:${FROM_DATE} (${typeof FROM_DATE}), ${dateToStr(FROM_DATE)} (${typeof dateToStr(
      FROM_DATE,
    )}), toDate:${TO_DATE} (${typeof TO_DATE}), ${dateToStr(TO_DATE)} (${typeof dateToStr(TO_DATE)})`,
  );
  process.stdout.write(`\n`);
};

const TestTimestampFormatting = () => {
  process.stdout.write(`${Cy}Pre-computed date/times for functions${R}\n`);
  process.stdout.write(`formatDate:${formatDate(new Date())}\n`);
  process.stdout.write(`formatDateWithDivider:${formatDateWithDivider(new Date())}\n\n`);
  process.stdout.write(`Examples of a random divider for the above function:\n`);
  process.stdout.write(`Beer dividers:${formatDateWithDivider(new Date(), '🍺')}\n`);
  process.stdout.write(`Hand dividers:${formatDateWithDivider(new Date(), '👋')}\n`);
  process.stdout.write(`compactLoggingData=>${Y}${compactLoggingTime()}${R}\n`);
  process.stdout.write(`eightCharDate=>${Y}${eightCharDate(new Date())}${R}\n`);
  process.stdout.write(`\n`);
};

const TestTimestampSchedules = () => {
  process.stdout.write(`${Cy}Date/timestamp functions for schedules${R}\n`);
  process.stdout.write(`${Y}UTC ${formatDateTime(new Date())}${R}\n`);
  process.stdout.write(`${Rd}Pacific Timezone conversion:${R}\n`);
  process.stdout.write(`UTC converted=>${convertUTCDateToLocalDate(new Date())}, as is UTC, ${new Date()}\n`);
  const weekend = isWeekend(convertUTCDateToLocalDate(new Date()).getDay());
  const isofficehours = isOfficeHours(convertUTCDateToLocalDate(new Date()).getHours());
  process.stdout.write(`isWeekend=>${weekend}\n`);
  process.stdout.write(`isOfficeHours=>${isofficehours}\n`);
  process.stdout.write(`\n`);
};

const TestCleanerTimestampPrinting = () => {
  process.stdout.write(`${Y}Updated cleaner timestamps for output logging.${R}\n`);
  const localtime = formatDateTime(convertUTCDateToLocalDate(new Date()));
  process.stdout.write(`formatDateTime=>${localtime}\n`);
  process.stdout.write(`compactLoggingFormat=>${compactLoggingTime()}\n`);
  process.stdout.write(`eightCharDate=>${eightCharDate(new Date())}\n`);
  process.stdout.write(`\n`);
};

const TestCleanUpTimestampZeros = () => {
  process.stdout.write(`${Y}Remove zero time section from precomputed date-time.${R}\n`);
  const extra = '00:00:00 GMT-0800 (Pacific Standard Time)';
  // eslint-disable-next-line max-len
  let sentence =
    `defaultStartDate=>${defaultStartDate}, \n` +
    `fortNightStartDate=> ${fortnightStartDate}, \n` +
    `lastWeekStartDate => ${lastWeekStartDate}, \n` +
    `threeDaysAgo => ${threeDaysAgoDate}, \n` +
    `yesterday => ${yesterdayStartDate} \n`;
  sentence = sentence.replace(extra, '');
  process.stdout.write(`${sentence}\n`);
};

export const TestDateRange = () => {
  const dateRange = { fromDate: '2020-11-01T00:00:00.000+00:00', toDate: '2021-03-01T00:00:00.000+00:00' };
  const results = getDaysDateRange(dateRange);
  for (let i = 0; i <= results.length; i++) {
    process.stdout.write(`${results[i].toISOString()}`);
  }
};

export const TestAllDateFunctions = () => {
  process.stdout.write(`${G}${_}datetime/timestamp library functions${R}\n`);
  TestAutoDates();
  TestDateRanges();
  TestTimestampFormats();
  TestTimestampFormatting();
  TestTimestampSchedules();
  TestCleanerTimestampPrinting();
  TestCleanUpTimestampZeros();  
  // const localtime = formatDateTime(convertUTCDateToLocalDate(new Date()));
  process.stdout.write(`Date/time to words:${dateToWords(convertUTCDateToLocalDate(new Date()))}\n`);
  process.stdout.write(
    `Cleanup time output:${fortnightStartDate
      .toString()
      .replace('00:00:00 GMT+0000 (Coordinated Universal Time)', '')}\n`,
  );
  process.stdout.write(sixteenCharDate(new Date()) + `\n`);
  process.stdout.write(`${G}Random No.${getRandomInt(1000)}, Random Alpha:${randomAlphanumeric(30)}${R}\n`);
  process.stdout.write(`\n`);
};

export const TestHolidayFunctions = () => {
  dateExamples.forEach(d => {
    const date = new Date(d);
    console.log(
      shiftForHoliday(
        date.getFullYear(),
        date.getMonth(),
        getWeekNumber(date.getFullYear(), date.getMonth(), date.getDate()),
        date.getDate(),
      ),
    );
  });
};

export const dateExamples = [
  '2021-01-01T09:09:00.000-08:00',
  '2021-01-02T09:09:00.000-08:00',
  '2021-01-03T09:09:00.000-08:00',
  '2021-01-04T09:09:00.000-08:00',
  '2021-01-05T09:09:00.000-08:00',
  '2021-01-06T09:09:00.000-08:00',
  '2021-01-07T09:09:00.000-08:00',
  '2021-01-08T09:09:00.000-08:00',
  '2021-01-09T09:09:00.000-08:00',
  '2021-01-10T09:09:00.000-08:00',
  '2021-01-11T09:09:00.000-08:00',
  '2021-02-01T09:09:00.000-08:00',
  '2021-03-01T10:09:00.000-08:00',
  '2021-04-01T11:09:00.000-08:00',
  '2021-05-01T10:09:00.000-08:00',
  '2021-06-01T08:09:00.000-08:00',
  '2021-07-01T11:09:00.000-08:00',
  '2021-08-01T12:09:00.000-08:00',
  '2021-09-01T05:09:00.000-08:00',
  '2021-10-01T02:09:00.000-08:00',
  '2021-02-02T03:09:00.000-08:00',
  '2021-01-24T04:09:00.000-08:00',
  '2021-04-25T12:09:00.000-08:00',
  '2021-12-23T11:09:00.000-08:00',
  '2021-12-24T10:09:00.000-08:00',
  '2021-12-01T08:09:00.000-08:00',
  '2021-12-02T08:09:00.000-08:00',
  '2021-12-04T08:09:00.000-08:00',
  '2021-12-08T08:09:00.000-08:00',
  '2021-12-10T08:09:00.000-08:00',
  '2021-12-15T08:09:00.000-08:00',
  '2021-12-18T08:09:00.000-08:00',
  '2021-12-20T08:09:00.000-08:00',
  '2021-12-30T08:09:00.000-08:00',
  '2021-10-10T12:09:00.000-08:00',
  '2021-10-12T12:09:00.000-08:00',
  '2021-10-14T12:20:00.000-08:00',
  '2021-10-16T12:09:00.000-08:00',
  '2021-10-18T12:18:00.000-08:00',
  '2021-10-20T12:09:00.000-08:00',
  '2021-10-22T12:09:00.000-08:00',
  '2021-10-24T12:15:00.000-08:00',
  '2021-11-20T11:09:00.000-08:00',
  '2021-03-23T10:09:00.000-08:00',
  '2021-11-24T11:19:00.000-08:00',
  '2021-10-04T12:09:00.000-08:00',
  '2021-11-15T09:22:00.000-08:00',
  '2021-02-22T08:09:00.000-08:00',
  '2021-07-04T09:07:12.345-08:00',
];

const BLANK = '';

export const compactDateTimeDev = (date: Date) => {
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

export const compactDateTimeToDate = (compact) => {
  const year = compact.substring(0, 4);
  const month = compact.substring(5, 6);
  const day = compact.substring(7, 8);
  const hour = compact.substring(10, 11);
  const minute = compact.substring(12, 13);
  const seconds = compact.substring(14, 15);
  const milli = compact.substring(16, 17);

  const newDate = new Date();
  newDate.setFullYear(year);
  newDate.setMonth(month - 1);
  newDate.setDate(day);
  newDate.setHours(hour);
  newDate.setMinutes(minute);
  newDate.setSeconds(minute);
  newDate.setMilliseconds(minute);
  console.log(year, month, day, hour, minute, seconds, milli);
  console.log(newDate.toLocaleString());
  return newDate;
}

export const TestBusinessSlot = () => {
  dateExamples.forEach(d => {
    const date = new Date(d);
    console.log(`\nThe date/time being evaluated:${d}.`);
    const nextTimeSlot = getNextBusinessSlot(date);
    console.log(new Date(nextTimeSlot).toString());
    console.log(compactDateTime(nextTimeSlot));
    compactDateTimeToDate(compactDateTime(nextTimeSlot));

    console.log(new Date('2021-07-04T09:07:12.345-08:00'));
    console.log(compactDateTime(new Date('2021-07-04T09:07:12.345-08:00',)));
    console.log(compactDateTimeToDate(compactDateTime(new Date('2021-07-04T09:07:12.345-08:00'))));

    const now = new Date();
    const cNow = compactDateTime(now);
    console.log(compactDateTime(now));
    console.log(compactDateTimeToDate(cNow));
  });

};

export const TestCompressedDateFormat = () => {
  const exDate = [
    '20210101',
    '20210112-23',
    '20210114-2345',
    '20210115-23453015',
    '20210116-23453015'
  ];
  exDate.forEach(d => console.log(parseDate(d)));
}

export const TestIDIAccountDocument = () => {
  const monthStartDate = moment().clone().startOf('month').format('YYYY-MM-DD').toString();
  const accountDocument = null;
  const docId = accountDocument ?? `idi-${monthStartDate}`;
  console.log(`Account document for this month:${docId}`);
};

export const TestCompressedDateFormatManipulation = () => {
  const compact = moment().format('YYYYMMDD-hhmmss');
  console.log(`'YYYYMMDD-hhmmss' => ${compact}`);
  const compactDate = moment(compact, 'YYYYMMDD-hhmmss').toDate();
  console.log(`Convert back to date => ${compactDate}`);
  console.log(`Add a week:${moment(compact, 'YYYYMMDD-hhmmss').add(1, 'week')}`);
}

// eslint-disable-next-line no-void
void (async () => {
  try {
    const range = { fromDate: fortnightStartDate, toDate: yesterdayStartDate };

    const dateRange = getDaysDateRange(range);
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < dateRange.length; i++) {
      const compact = moment(dateRange[i]).format('YYYYMMDDhhmmssSS');
      console.log(`Convert:${dateRange[i]} to ${compact} format.`);
      console.log(`Convert back:${moment(compact, 'YYYYMMDDhhmmssSS').toDate()} to date format`);
    }

  } catch (e) {
    console.error(e);
  }
});
