export const AdvisorPhones = [];

export const PhoneNumberAdvisorEmailMap = [
  [AdvisorPhones[0], 'help@ex.com'],
  [AdvisorPhones[2], 'spanish@ex.com'],
  [AdvisorPhones[3], 'advisor@ex.com'],
];

export const AdvisorsPhoneScheduleMap = new Map([
  ['', ''],  // Some date format  
]);

import { FORWARDING_NUMBER_ONE } from '../../../firebase'

export const AttendantPhoneSchedule = () => {
  return FORWARDING_NUMBER_ONE;
};
