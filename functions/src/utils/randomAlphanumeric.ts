import { emojis } from './emoji';

export const randomEmojis = emojis[Math.floor(Math.random() * emojis.length)];

export const randomAlphanumeric = (length: number) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export const randomUpperAlphabet = (length: number) => {
  const chars = 'ABCDEFGIJKLMNOPRSTUVWXYZ';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export const randomLowerAlphabet = (length: number = 1) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const getRandomArrayElements = (arr: any, n: number): any => {
  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  let nn = n;
  if (nn > len) throw new RangeError(`Sorry, you can't ask for more elements than are in the array.`);
  while (nn--) {
    const x = Math.floor(Math.random() * len);
    result[nn] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}
