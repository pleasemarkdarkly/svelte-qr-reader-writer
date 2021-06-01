import { numToWords } from './num-to-words';
import { FgGreen as G, FgYellow as Y, FgRed as Rd, Reset as R } from './string';

const numToWordsBritish = () => {
  // See https://www.mathsisfun.com/numbers/counting-names-1000.html
  const textForNumbers = {
    1: 'one',
    10: 'ten',
    20: 'twenty',
    21: 'twenty-one',
    53: 'fifty-three',
    55: 'fifty-five',
    60: 'sixty',
    72: 'seventy-two',
    99: 'ninety-nine',
    101: 'one hundred and one',
    116: 'one hundred and sixteen',
    144: 'one hundred and forty-four',
    212: 'two hundred and twelve',
    271: 'two hundred and seventy-one',
    621: 'six hundred and twenty-one',
    999: 'nine hundred and ninety-nine',
    1101: 'one thousand, one hundred and one',
    1234: 'one thousand, two hundred and thirty-four',
    15016: 'fifteen thousand, and sixteen',
    112621: 'one hundred and twelve thousand, six hundred and twenty-one',
    999999: 'nine hundred and ninety-nine thousand, nine hundred and ninety-nine',
    1006101: 'one million, six thousand, one hundred and one',
    191232891: 'one hundred and ninety-one million, two hundred and thirty-two thousand, eight hundred and ninety-one',
    999999999: 'nine hundred and ninety-nine million, nine hundred and ninety-nine thousand, nine hundred and ninety-nine',
    1000000001: 'one billion, and one',
    1000000000000025: 'one thousand trillion, and twenty-five',
  };

  process.stdout.write(`${Y}Compare the generated output to a incorrectly computed number - FAILS${R}\n`);
  for (const [number, text] of Object.entries(textForNumbers)) {
    const numWords = numToWords(parseInt(number) - 1);
    if (numWords !== text) process.stdout.write(`${G}${numWords} !== ${text}${R}\n`);
    if (numWords === text) process.stdout.write(`${Rd}${numWords} === ${text}${R}\n`);
  }

  process.stdout.write(`${Y}Compare the generated output to a the original number - PASSING${R}\n`);
  for (const [number, text] of Object.entries(textForNumbers)) {
    const numWords = numToWords(number);
    if (numWords !== text) process.stdout.write(`${Rd}${numWords} !== ${text}${R}\n`);
    if (numWords === text) process.stdout.write(`${G}${numWords} === ${text}${R}\n`);
  }
};

// eslint-disable-next-line no-void
void (async () => {
  process.stdout.write(`${Y}Generate words from numbers.${R}\n`);
  numToWordsBritish();
  process.stdout.write(`\n`);

  process.stdout.write(`${Y}ten thousand and one.${R}\n`);
  numToWords(10001, { ands: true, commas: true });

  process.stdout.write(`${Y}One hundred and eleven.${R}\n`);
  numToWords(111, { ands: true, commas: true });

  process.stdout.write(`${Y}One billion, and one.${R}\n`);
  numToWords(1000000001, { ands: true, commas: true });

  process.stdout.write(`${Y}One billion, one.${R}\n`);
  numToWords(1000000001, { ands: true });

  process.stdout.write(`${Y}One billion one.${R}\n`);
  numToWords(1000000001);
  process.stdout.write(`\n`);
});
