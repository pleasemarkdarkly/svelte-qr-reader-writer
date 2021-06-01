import * as numberToWords from 'number-to-words';

const monthNames = [
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function monthToString(month: number) { return monthNames[month]; }

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function dateToString(date: number) { return numberToWords.toWordsOrdinal(date); }

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function yearToString(year: number) {
  const leftHalf = Math.floor(year / 100);
  const rightHalf = year % 100;

  if (rightHalf < 10) { // Years at start of a century (1900...1909, 2000...2009, etc)
    if (leftHalf % 10 === 0) { // ...Years at start of a millennium (1000...1009, 2000...2009 etc)
      if (rightHalf === 0) {
        return numberToWords.toWords(leftHalf / 10)
          + ' thousand';
      } else {
        return numberToWords.toWords(leftHalf / 10) +
          ' thousand ' +
          numberToWords.toWords(rightHalf);
      }
    }
    else { // ...Years in middle of a millennium (1700...1709, 1900...1909)
      if (rightHalf === 0) {
        return numberToWords.toWords(leftHalf) + ' hundred';
      } else {
        return numberToWords.toWords(leftHalf) + ' hundred ' + numberToWords.toWords(rightHalf);
      }
    }
  }
  else {  // Normal years (2015, 1978, etc)
    return numberToWords.toWords(leftHalf) +
      ' ' +
      numberToWords.toWords(rightHalf);
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function composeDateWords(month: string, date: string, year: string) {
  return month + ' the ' + date + ', ' + year;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const dateToWords = (dateObject: Date) => {
  const monthString = monthToString(dateObject.getMonth());
  const dateString = dateToString(dateObject.getDate());
  const yearString = yearToString(dateObject.getFullYear());
  return composeDateWords(monthString, dateString, yearString);
};
