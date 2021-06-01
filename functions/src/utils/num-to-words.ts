import { shouldPrefixWithOne, shouldHyphenate } from './shouldPrefix';
import { numbers, andWord } from './numbers';

export const numToWords = (numToConvert, options = {}) => {
  // @ts-ignore
  const andForBritish = options.ands || false;
  // @ts-ignore
  const comma = options.commas ? ',' : '';
  const and = andForBritish ? andWord + ' ' : '';
  let words = '';
  // let prefixNum: number;
  // let remainder: number;
  let closestSmallerNumber;
  let closestSmallerNumberText;

  // eslint-disable-next-line no-param-reassign
  numToConvert = parseInt(numToConvert, 10);

  if (isNaN(numToConvert)) {
    return 'not a number';
  }
  if (!isFinite(numToConvert)) {
    return 'infinity';
  }

  if (numToConvert < 0) {
    words += 'negative ';
    // eslint-disable-next-line no-param-reassign
    numToConvert *= -1;
  }

  // Search list of numbers for closest smaller number.
  // numToConvert will be written in terms of this number.
  for (const { number, text } of numbers) {
    if (numToConvert === number) {
      if (shouldPrefixWithOne(number)) {
        words += 'one ';
      }
      words += text;
      return words;
    }

    if (numToConvert > number) {
      closestSmallerNumber = number;
      closestSmallerNumberText = text;
      break;
    }
  }

  // How many 'closestSmallerNumber's can numToConvert be grouped into? e.g. five 'thousand'.
  const prefixNum = Math.floor(numToConvert / closestSmallerNumber);
  if (prefixNum !== 1 || shouldPrefixWithOne(closestSmallerNumber)) {
    words += numToWords(prefixNum, options) + ' ';
  }

  words += closestSmallerNumberText;

  const remainder = numToConvert - prefixNum * closestSmallerNumber;
  if (remainder > 0 && shouldHyphenate(closestSmallerNumber)) {
    words += '-';
  } else if (closestSmallerNumber >= 1000 && remainder > 0 && remainder < 100) {
    words += comma + ' ' + and;
  } else if (closestSmallerNumber >= 1000 && remainder > 0) {
    words += comma + ' ';
  } else if (closestSmallerNumber === 100 && remainder > 0) {
    words += ' ' + and;
  } else {
    words += ' ';
  }

  if (remainder > 0) {
    words += numToWords(remainder, options);
  }
  return words.trim();
};
