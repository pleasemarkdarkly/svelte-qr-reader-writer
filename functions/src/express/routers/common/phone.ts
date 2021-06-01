import * as functions from 'firebase-functions';
import { SPACE, BLANK } from '../../../utils';

const units = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export const convertNumbersToWords = (random: string) => {
  let sentence: string = BLANK;
  const local_random = random.replace(/\D/g, ''); // remove any non-digit
  if (local_random.length === 0 || local_random === undefined) {
    functions.logger.error('error input has not length');
    return undefined;
  } else {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < local_random.length; i++) {
      sentence = sentence + SPACE + units[local_random[i]];
    }
    return sentence + '.';
  }
};

export const convertPhoneToSpeech = (phone: string) => {
  let sentence: string = BLANK;
  // phone = phone.replace(/\D/g, '');
  if (phone.length === 0 || phone === undefined) {
    functions.logger.warn('error input has no length');
    return undefined;
  } else {
    if (phone[0] !== '+') {
      functions.logger.warn('error: phone number must be in E.164 format');
      return undefined;
    }
    for (let i = 2; i < phone.length; i++) {
      // Skip over the + and 1
      if (i === 5 || i === 8) sentence += ', ';
      sentence = sentence + SPACE + units[phone[i]];
    }
    return sentence + '.';
  }
};
