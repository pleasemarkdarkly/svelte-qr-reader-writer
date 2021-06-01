export const phoneFormatE164 = /^\+[1-9]\d{1,14}$/;
// eslint-disable-next-line max-len
export const emailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const domainFormat = /^([a-z0-9])(([a-z0-9-]{1,61})?[a-z0-9]{1})?(\.[a-z0-9](([a-z0-9-]{1,61})?[a-z0-9]{1})?)?(\.[a-zA-Z]{2,4})+$/;
export const titleCase = (name: string) => {
  return name.slice(0, 1).toUpperCase() + name.slice(1, name.length).toLowerCase();
};

export const hyphenPhone = (phone: string) => {
  let searchNumber;
  if (phone[0] === '+' && phone[1] === '1') {
    searchNumber = phone.substr(2);
  } else searchNumber = phone;
  return searchNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
}

export const prepNumberforTwilio = (phone: string) => {
  let update = phone;
  if (phone.length === 10) update = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  if (phone[0] !== '+') return `+1-${update}`;
  return update;
};

export const prepNumberforFirestoreSearch = (phone: string) => {
  let update = phone;
  if (phone[0] === '+' && phone[1] === '1' && phone[2] === '-') update = phone.substr(3);
  return update.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
};

export const convertE164 = (phoneNumber: string) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = (match[1] ? '+1' : '')
    return [intlCode, '-', match[2], '-', match[3], '-', match[4]].join('')
  }
  return phoneNumber;
};

export const stripPlusOne = (phone: string) => {
  return phone.substr(3).replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
};

function throwTypeError() {
  throw new TypeError('The given URL/email is not a string. Please verify your string|array.');
};

import * as functions from 'firebase-functions';

export const dashedNumber = (value) => {
  const afterIndices = [3, 6, 8];
  const length = value.length;
  let newValue = ''
  for (let i = 0; i < length; i++) {
    if (afterIndices.includes(i))
      newValue += '-'
    newValue += value[i];
  }
  return newValue;
}

export const uniformPhone = (phone: string) => {
  const regEx = /^(1|)?(\d{3})(\d{3})(\d{4})$/;
  const cleaned = ('' + phone).replace(/\D/g, '');
  if (cleaned.length >= 12) return undefined;
  if (cleaned.length < 10)
    return undefined;
  if (cleaned.length === 10 || cleaned.length === 11) {
    const match = cleaned.match(regEx);
    console.log(match);
    if (match) {
      const intlCode = (match[1] ? '+1' : '')
      return [intlCode, '-', match[2], '-', match[3], '-', match[4]].join('')
    } else return undefined;
  } else {
    return undefined;
  }
}

const endings = ['/', ':', '?', '#'];
const starters = ['.', '/', '@'];

export const getDomainFromUrl = (url) => {
  if (typeof url !== 'string') {
    throwTypeError();
  }

  let domainInc = 0;
  let offsetDomain = 0;
  let offsetStartSlice = 0;
  let offsetPath = 0;
  let len = url.length;
  let i = 0;

  while (len-- && ++i) {
    if (domainInc && endings.indexOf(url[i]) > -1) { break; }
    if (url[i] !== '.') { continue; }
    ++domainInc;
    offsetDomain = i;
  }

  offsetPath = i;
  i = offsetDomain;

  while (i--) {
    if (starters.indexOf(url[i]) === -1) { continue; }
    offsetStartSlice = i + 1;
    break;
  }

  if (offsetStartSlice < 2) { return ''; }
  return url.slice(offsetStartSlice, offsetPath);
}

export const extractDomain = (urls) => {
  if (typeof urls === 'string') {
    return getDomainFromUrl(urls);
  } else if (Array.isArray(urls)) {
    const extractedUrls: string[] = [];

    for (let i = 0, len = urls.length; i < len; i++) {
      if (urls[i] !== undefined) {
        extractedUrls.push(getDomainFromUrl(urls[i]));
      }
    }

    return extractedUrls;
  } else {
    throwTypeError();
  }
};

export const examplePhoneCorrection = () => {
  const exPhone = [
    '120616079415',
    '12066079415',
    '+12066079415',
    '2066079415',
    '+1-206-607-9415',
    '1206160794175',
  ];

  exPhone.forEach(p => {
    const updated = uniformPhone(p);
    if (updated !== undefined) functions.logger.info(`${p}`);
  });
}

// (async () => { });