import * as bytes from 'utf8-length';

export const PROCESS_EXIT_SUCCESS = 0;
export const Megabyte = 1048576;
export const MB = Megabyte;
export const MAX_TIME = 60 * 9; // config?.functions?.max_duration

export const timezone = 'America/Los_Angeles';

export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const jsonSize =
  (s: string | undefined) => {
    if (!s || s === undefined) return 0;
    return bytes(JSON.stringify(s));
  };

export const sizeInBytes = (s: string) => {
  return bytes(JSON.stringify(s));
};

export const currentFunction = () => {
  const e = new Error('dummy');
  if (e.stack !== undefined) {
    const stack = e?.stack
      .split('\n')[2]
      // " at functionName ( ..." => "functionName"
      .replace(/^\s+at\s+(.+?)\s.+/g, '$1');
    return stack
  } return undefined;
};

// eslint-disable-next-line no-void
export const order = (default_order) => {
  return Object.keys(default_order).sort().reduce(
    (obj, key) => {
      obj[key] = default_order[key]; return obj;
    }, {});
};

export const type = (object: Object) => {
  return Object.prototype.toString.apply(object).replace(/\[object (.+)\]/i, '$1').toLowerCase();
};

import * as functions from 'firebase-functions';

export const errorFn = (e) => {
  if (e.stack !== undefined) {
    const stack = e?.stack
      .split('\n')[2]
      // " at functionName ( ..." => "functionName"
      .replace(/^\s+at\s+(.+?)\s.+/g, '$1');
    functions.logger.error(e.message, stack);
  }
};

export const deepCopy = (obj: any) => {
  let copy: any;
  if (null === obj ||
    'object' !== typeof obj) return obj;
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepCopy(obj[i]);
    }
    return copy;
  }
  if (obj instanceof Object) {
    copy = {};
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr))
        copy[attr] = deepCopy(obj[attr]);
    }
    return copy;
  }
  throw new Error('Unable to copy object. ');
};

// (async () => { });