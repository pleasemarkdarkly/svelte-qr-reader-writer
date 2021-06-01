import * as moment from 'moment';
import * as functions from 'firebase-functions';
import { convertE164 } from '../utils';
import { addEntryByTimestamp, isEntryPresent } from '../utils';

export const checkSMSOffers = async (options) => {
    try {
        const { address: mobile } = options;
        return await isEntryPresent('conversations', 'twilio_offers', mobile);
    } catch (e) { functions.logger.error(e); return e; }
};

export const setMobileSMSToOffers = async (options) => {
    try {
        const { address: mobile } = options;
        return await addEntryByTimestamp(
            'conversations',
            'twilio_offers',
            moment().format('YYYYMMDD-hhmmss'),
            convertE164(mobile));
    } catch (e) { functions.logger.error(e); return e; }
};
