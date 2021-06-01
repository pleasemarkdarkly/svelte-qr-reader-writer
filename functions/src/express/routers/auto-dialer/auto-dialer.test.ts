// import * as moment from 'moment';
import * as functions from 'firebase-functions';
import { fetch } from '../../../utils';

type ActivityType = 'call' | 'sms' | 'email';
export interface Activity {
    type: ActivityType;
    address: string;
    description: string;
    response: string;
    performedAt: Date;
};

// eslint-disable-next-line no-void
void (async () => {
    const selects = [
        { number: "+1-ENTER_NUMBER_HERE" },
    ];

    try {
        const resp = await fetch('https://example.cloudfunctions.net/twilio/auto-dialer', {
            method: 'post',
            body: JSON.stringify(selects[0]),
            headers: { 'Content-Type': 'application/json' }
        });
        const auto_dialer = { phone: selects[0], status: resp.status };
        // eslint-disable-next-line max-len
        if (resp.status === '200') functions.logger.info(`Successfully submitted ${auto_dialer.phone} to be called, `, JSON.stringify(auto_dialer));
        else functions.logger.error(`Twilio responded to autodialer with ${auto_dialer.status}, `, JSON.stringify(auto_dialer));
        // await addEntryByTimestamp('conversations', 'twilio_autodialer', moment().format('YYYYMMDD-hhmmss'), JSON.stringify(auto_dialer));
    } catch (e) { functions.logger.error(e); return e; }

})();

