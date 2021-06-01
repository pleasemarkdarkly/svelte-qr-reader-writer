import * as functions from 'firebase-functions';
import { VERBOSE, fireapp } from '../../../firebase';
import { TwilioError } from '../../../models';
import { BLANK, compactLoggingDateTime } from '../../../utils';

type TwilioWebhookEvent = [string, string, string];
export class TwilioWebhookParse {
    static payload;

    constructor() {
        TwilioWebhookParse.payload = BLANK;
    };

    public static webhookManualParser = (example: string) => {
        const error: { [x: string]: any } = {};
        if (example.includes('30007') ||
            example.includes('30003')) {
            const parser = example.replace(/\{|\}/gi, '')
                .replace('"Payload": "', '').split(',');
            const parserLen = parser.length;
            for (let k = 0; k < parserLen; k++) {
                const keyValue = parser[k];
                let entry;
                if (keyValue.includes('Timestamp')) {
                    error.Timestamp = new Date(keyValue
                        .replace('\"Timestamp\":', '')
                        .replace(/[\"\s+"]/gi, ''));
                } else {
                    entry = keyValue
                        .replace(/[\"\s+"]/gi, '').split(':');
                    switch (entry[0]) {
                        case 'Level': error.Level = entry[1]; break;
                        case 'Sid': error.Sid = entry[1]; break;
                        case 'PayloadType': error.PayloadType = entry[1]; break;
                        case 'AccountSid': error.AccountSid = entry[1]; break;
                        case 'error_code': error.Payload.error_code = entry[1]; break;
                        case 'service_sid': error.Payload.service_sid = entry[1]; break;
                        case 'resource_sid': error.Payload.resource_sid = entry[1]; break;
                    }
                }
            }
        } else {
            VERBOSE && functions.logger.warn(`Send notification to operator of unrecongized Twilio Error requiring parsing.`);
        }
        return error;
    }

    public static Parse = async () => {
        const events: TwilioWebhookEvent[] = [];
        try {
            const docRef = await fireapp
                .firestore()
                .collection('configuration')
                .doc('twilio_webhook_errors')
                .get();

            const snapshot: any[] = [];;
            const datetimeErrors: Map<string, string[]> = new Map();
            if (docRef.exists) {
                snapshot.push(docRef.data());
                const keys = Array.from(Object.keys(snapshot[0]))
                    .filter((v, i, a) => { return v !== 'accessedOn' }).sort();
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < keys.length; i++) {
                    const errors: string[] = [];
                    snapshot[0][keys[i]].map((m: any) => errors.push(m));
                    datetimeErrors.set(keys[i], errors);
                }
                const datetimeCount = datetimeErrors.size;
                const datetimes = datetimeErrors.keys();
                functions.logger.info(`Webhook intervals(${datetimeCount}):${datetimes}`);
                datetimeErrors.forEach(t => {
                    const entries = t;
                    const entriesCount = entries.length;
                    for (let j = 0; j < entriesCount; j++) {
                        TwilioWebhookParse.payload = entries[j];
                        try {
                            const response: TwilioError = JSON.parse(entries[j]);
                            const { Timestamp, Level, PayloadType, Payload } = response;
                            if (Level === 'ERROR')
                                if (PayloadType === 'application/json') {
                                    if (Payload !== undefined) {
                                        const { resource_sid, service_sid, error_code } = Payload;
                                        functions.logger.info(`[${Timestamp}] ${error_code}, ${resource_sid}, ${service_sid}`);
                                        if (error_code === '30007' ||
                                            error_code === '30003') {
                                            functions.logger.warn(`SMS traffic is being marked as SPAM, ` +
                                                `throttle or shutdown sender to debug.`);
                                        }
                                    }
                                }
                        } catch (e) {
                            VERBOSE && functions.logger.warn(`JSON Parse failed extracting the TwilioError entry.`);
                            const error = TwilioWebhookParse.webhookManualParser(TwilioWebhookParse.payload);
                            if (error !== undefined) {
                                VERBOSE && console.log([error.service_sid, error.error_code, error.Level]);
                                try {
                                    events.push([error.service_sid, error.error_code, error.Level]);
                                } catch (err) { functions.logger.error(err); }
                                VERBOSE && console.log(error);
                            }
                        }
                    }
                });
            } else {
                functions.logger.warn(`Error encountered, configuration collection or twilio_webhook_errors not found.`);
            }
            return events;
        } catch (e) {
            functions.logger.error(`TwilioWebhook parser should be able to handle manually parsing.`);
            return undefined;
        }
    }
};

(async () => {
    const thisFileName = __filename.split('/')[__filename.split('/').length - 1];
    functions.logger.info(`${compactLoggingDateTime()} ${thisFileName}...`);
    const webhook_events = await TwilioWebhookParse.Parse();
    console.log(webhook_events);
});
