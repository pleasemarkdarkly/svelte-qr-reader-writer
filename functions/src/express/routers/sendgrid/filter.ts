import * as functions from 'firebase-functions';
import * as EventEmitter from 'events';
import { SendgridEvent } from '../../../models';
import { VERBOSE, SLACK_NOTIFICATIONS, firebase, fireapp } from '../../../firebase';
import { SlackInstrument, SLACK_CHANNEL } from '../../../slack';
interface WebhookCallbacks {
    'started': () => void;
    'bounce': (event: SendgridEvent) => void;
    'dropped': (event: SendgridEvent) => void;
    'deferred': (event: SendgridEvent) => void;
    'unsubscribed': (event: SendgridEvent) => void;
    'spamreport': (event: SendgridEvent) => void;
    'delivered': (event: SendgridEvent) => void;
    'click': (event: SendgridEvent) => void;
    'open': (event: SendgridEvent) => void;
    'processed': (event: SendgridEvent) => void;
}
export class SendgridWebhookFilter extends EventEmitter.EventEmitter {
    constructor(public concurrency = 8) { super(); }

    public async fetchSendgridWebhookEvents() {
        try {
            const sgWhEventsRef = await fireapp
                .firestore()
                .collection('conversations')
                .doc('sendgrid_webhook_events')
                .get();
            const sgEventBlob: any[] = [];
            const sgWebhookEvents: any[] = [];
            const notify = new SlackInstrument(`Sendgrid Email/Event Filtering Processing`);
            SLACK_NOTIFICATIONS && await notify.add(`Searching for Sendgrid email logs for address(es) ` +
                `associated with bounce, deferred, unsubscribed, spamreport.`);
            if (sgWhEventsRef.exists) {
                sgEventBlob.push(sgWhEventsRef.data());
                const days = Object.keys(sgEventBlob[0]);
                days.forEach(async d => {
                    if (d !== 'accessedOn') {
                        SLACK_NOTIFICATIONS && await notify.add(`Scanning:${d}`);
                        sgWebhookEvents.push(sgEventBlob[0][d]);
                        const events = Array.from((sgEventBlob[0][d]));
                        let event: SendgridEvent;
                        // let eventText: string;
                        events.forEach(async e => {
                            try {
                                // eventText = String(e).substring(1, eventText.length() - 1);
                                const { payload } = JSON.parse(String(e));
                                event = payload[0];
                                const emails = firebase
                                    .firestore
                                    .FieldValue
                                    .arrayUnion(event?.email);
                                switch (event?.event) {
                                    case ('bounce'):
                                        this.emit('bounce', event);
                                        break;
                                    case ('deferred'):
                                        this.emit('deferred', event);
                                        break;
                                    case ('unsubscribed'):
                                        this.emit('unsubscribed', event);
                                        break;
                                    case ('spamreport'):
                                        this.emit('spamreport', event);
                                        await fireapp
                                            .firestore()
                                            .collection('conversations')
                                            .doc('sendgrid_filter')
                                            .set({ emails: emails, accessedOn: new Date() },
                                                { merge: true });
                                        // await notify.add(`${event?.email}`);
                                        break;
                                    case ('processed'):
                                        this.emit('processed', event);
                                        break;
                                    case ('dropped'):
                                        this.emit('dropped', event);
                                        break;
                                    case ('delivered'):
                                        this.emit('delivered', event);
                                    case ('open'):
                                        this.emit('open', event);
                                        await fireapp
                                            .firestore()
                                            .collection('conversations')
                                            .doc('sendgrid_open')
                                            .set({ emails: emails, accessedOn: new Date() },
                                                { merge: true });
                                        await notify.add(`${event?.email}`);
                                        break;
                                    case ('click'):
                                        this.emit('click', event);
                                        await fireapp
                                            .firestore()
                                            .collection('conversations')
                                            .doc('sendgrid_click')
                                            .set({ emails: emails, accessedOn: new Date() },
                                                { merge: true });
                                        await notify.add(`${event?.email}`);
                                        break;
                                    default:
                                        break;
                                };
                            } catch (error) {
                                // functions.logger.info(`Parsing sgEventBlob encountered issues. Aborting.`);
                                // console.log(String(e) + '\n');
                                return;
                            }
                        });
                    }
                });
                SLACK_NOTIFICATIONS && await notify.send(SLACK_CHANNEL.EMAIL);
            }
            return;
        } catch (e) {
            functions.logger.error(e);
            return e;
        }
    }

    public async debugSendgridWebhookEvents() {
        try {
            this.emit('started');
            const sgWhEventsRef = await fireapp
                .firestore()
                .collection('conversations')
                .doc('sendgrid_webhook_events')
                .get();
            const sgEventBlob: any[] = [];
            const sgWebhookEvents: any[] = [];
            if (sgWhEventsRef.exists) {
                sgEventBlob.push(sgWhEventsRef.data());
                const days = Object.keys(sgEventBlob[0]);
                days.forEach(async d => {
                    if (d !== 'accessedOn') {
                        sgWebhookEvents.push(sgEventBlob[0][d]);
                        const events = Array.from((sgEventBlob[0][d]));
                        events.forEach(async e => {
                            try {
                                const { payload } = JSON.parse(String(e));
                                const event: SendgridEvent = payload[0];

                                // console.log(moment.unix(parseInt(event.timestamp)).format('YYYYDDMM-hhmmssSSS'));

                                VERBOSE && console.log(event);

                                switch (event?.event) {
                                    case ('bounce'):
                                        functions.logger.warn(`Debug bounce occured:${event.email} add to bounce filter...`);
                                        this.emit(`bounce`, event);
                                        break;
                                    case ('deferred'):
                                        this.emit(`deferred`, event);
                                        break;
                                    case ('dropped'):
                                        functions.logger.warn(`Debug dropped occured:${event.email} update filter...`);
                                        this.emit(`dropped`, event);
                                        break;
                                    case ('unsubscribed'):
                                        this.emit(`unsubscribed`, event);
                                        break;
                                    case ('processed'):
                                        this.emit(`processed`, event);
                                        break;
                                    case ('spamreport'):
                                        this.emit(`spamreport`, event);
                                        break;
                                    case ('delivered'):
                                        this.emit(`delivered`, event);
                                        break;
                                    case ('open'):
                                        this.emit(`open`, event);
                                        break;
                                    case ('click'):
                                        this.emit(`click`, event);
                                        break;
                                    default:
                                        break;
                                };
                            } catch (error) {
                                functions.logger.error(error);
                                return;
                            }
                        });
                    }
                });

            }
            return;
        } catch (e) {
            functions.logger.error(e);
            return e;
        }
    };

    on<T extends keyof WebhookCallbacks>(event: T, listener: WebhookCallbacks[T]): this { return super.on(event, listener); }
    emit<T extends keyof WebhookCallbacks>(event: T, ...args: Parameters<WebhookCallbacks[T]>) { return super.emit(event, ...args); }
};
