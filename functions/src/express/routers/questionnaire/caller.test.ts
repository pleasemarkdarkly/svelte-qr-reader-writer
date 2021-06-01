import * as functions from 'firebase-functions';
// import * as moment from 'moment';
// import { addEntryByTimestamp } from '../../../utils';
import { fetch } from '../../../utils';

// eslint-disable-next-line no-void
void (async () => {
    try {
        const body = { number: "+1" };
        const resp = await fetch('https://ex.cloudfunctions.net/twilio/questionnaire', {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });

        console.log(resp.status);
        // await addEntryByTimestamp('conversations', ' twilio_autodialer', moment().format('YYYYMMDD-hhmmss'), JSON.stringify(auto_dialer));

    } catch (e) {
        functions.logger.info(e);
        return e;
    }
});



