export const MINUTE = '* * * * *';
export const ELEVEN_PM = '0 23 * * *';
export const MIDNIGHT = '0 0 * * *';
export const ONE_AM = '0 1 * * *';
export const TWO_AM = '0 2 * * *';
export const FIVE_MINUTES = '*/5 * * * *';
export const MIDNIGHT_SUNDAY = '0 0 * * 0';
export const ONE_AM_SUNDAY = '0 1 * * 0';
export const TWO_AM_SUNDAY = '0 2 * * 0';
export const THREE_AM_SUNDAY = '0 3 * * 0';
export const EIGHT_AM = '0 8 * * 1-5';
export const EIGHT_THIRTY_AM = '1/30 8 * * 1-5';
export const TEN_AM = '0 10 * * *';
export const TEN_AM_MONDAY_FRIDAY = '0 10 * * 1-5';
export const FOUR_PM_MONDAY_FRIDAY = '59 3 * * 1-5';

export const EIGHT_AM_MONDAY_WEDNESDAY_FRIDAY = '0 8 * * 1,3,5';
export const EIGHT_THIRTY_AM_MONDAY_WEDNESDAY_FRIDAY = '30 8 * * 1,3,5';
export const NINE_AM_MONDAY_WEDNESDAY_FRIDAY = '0 9 * * 1,3,5';
export const NINE_FIFTHTEEN_AM_MONDAY_WEDNESDAY_FRIDAY = '15 9 * * 1,3,5';
export const NINE_THIRTY_AM_MONDAY_WEDNESDAY_FRIDAY = '30 9 * * 1,3,5';
export const NINE_FOURTY_FIVE_AM_MONDAY_WEDNESDAY_FRIDAY = '45 9 * * 1,3,5';
export const TEN_AM_MONDAY_WEDNESDAY_FRIDAY = '0 10 * * 1,3,5';
export const TEN_FIFTHTEEN_AM_MONDAY_WEDNESDAY_FRIDAY = '15 10 * * 1,3,5';
export const TEN_THIRTY_AM_MONDAY_WEDNESDAY_FRIDAY = '30 10 * * 1,3,5';
export const TEN_FOURTY_FIVE_AM_MONDAY_WEDNESDAY_FRIDAY = '45 10 * * 1,3,5';
export const ELEVEN_AM_MONDAY_WEDNESDAY_FRIDAY = '0 11 * * 1,3,5';
export const ELEVEN_FIFTHTEEN_AM_MONDAY_WEDNESDAY_FRIDAY = '15 11 * * 1,3,5';
export const ELEVEN_THIRTY_AM_MONDAY_WEDNESDAY_FRIDAY = '30 11 * * 1,3,5';
export const ELEVEN_FOURTY_FIVE_AM_MONDAY_WEDNESDAY_FRIDAY = '45 11 * * 1,3,5';
export const TWELVE_NOON_AM_MONDAY_WEDNESDAY_FRIDAY = '00 12 * * 1,3,5';
export const FOUR_PM_MONDAY_WEDNESDAY_FRIDAY = '59 3 * * 1,3,5';
export const ONE_AM_MONDAY_WEDNESDAY_FRIDAY = '0 1 * * 1,3,5';

export const EVERY = '*';
export const EVERY_MINUTE = '*';
export const EVERY_FIFTH_MINUTE = '*/5'
export const OFFICE_HOURS = '12-18';
export const MONDAY_FRIDAY = '1-5';
export const MONDAY_WEDNESDAY_FRIDAY = '1,3,5';

export const EVERY_FIVE_MINS_BTW_NOON_FIVE_PM_MON_WED_FRI =
    EVERY_FIFTH_MINUTE + ` ` +  // MINUTE
    OFFICE_HOURS + ` ` +
    EVERY + ` ` +               // DAY OF MONTH    
    EVERY + ` ` +               // MONTH    
    MONDAY_WEDNESDAY_FRIDAY;

export const EVERY_FIVE_MINUTES_BETWEEN_NOON_FIVE_PM_MONDAY_WEDNESDAY_FRIDAY = '*/5 12-17 * * 1,3,5'

export const EVERY_MINUTE_OFFICE_HOURS_MONDAY_FRIDAY =
    EVERY + ` ` + // MINUTE
    OFFICE_HOURS + ` ` +
    EVERY + ` ` + // DAY OF MONTH    
    EVERY + ` ` + // MONTH    
    MONDAY_FRIDAY;



(async () => { console.log(); });