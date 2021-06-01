import { BLANK } from '../utils';

export const replaceUndefinedWithBlank = (value: string | undefined) => {
  if (value === undefined) return BLANK;
  else return value.trim();
};

export const reUnBLANK = replaceUndefinedWithBlank;

export const isBlank = (value: string) => {
  return value === null || value.length === 0;
};

export const isBLK = isBlank;

export const getPropValue = (obj, key) =>
  key.split('.').reduce(
    (o, x) => // eslint-disable-next-line eqeqeq
      o == undefined ? o : o[x],
    obj,
  );

export const removeEmpty = obj => {
  return Object.entries(obj)
    .filter(([_, v]) => v !== BLANK)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? removeEmpty(v) : v }), {});
};

export const re = removeEmpty;

export const rmUn = (obj: any) => {
  return Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
};

export const e = object => {
  return Object.entries(object)
    .filter(([_, v]) => v !== '')
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? e(v) : v }), {});
};

export const rmUndefinedProperty = <T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> => {
  const o: Omit<T, K> & Partial<Pick<T, K>> = { ...obj };
  delete o[key];
  return o;
};

export const makeArray = <T>(x: T): T[] => { return [x]; }

// (async () => { });