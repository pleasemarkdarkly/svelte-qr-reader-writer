import * as EventEmitter from 'events';
import * as moment from 'moment';
import * as functions from 'firebase-functions';

export const VERBOSE = false;
interface SendgridWebhookCallbacks {
    'started': () => void;
    'ended': () => void;
    'dispatch': (payload) => void;
    'undefined': (...rest) => void;
    'error': (...rest) => void;
    'processed': (...rest) => void;
    'dropped': (...rest) => void;
    'delivered': (...rest) => void;
    'deferred': (...rest) => void;
    'bounce': (...rest) => void;
    'blocked': (...rest) => void;
    'open': (...rest) => void;
    'click': (...rest) => void;
    'spamreport': (...rest) => void;
    'unsubscribe': (...rest) => void;
};

type SendgridWebhookCallbackKeys = keyof SendgridWebhookCallbacks;
export class SendgridWebhookEvents extends EventEmitter {
    private static instance: SendgridWebhookEvents;

    constructor() { super(); };

    static getInstance = () => {
        if (!SendgridWebhookEvents.instance) { SendgridWebhookEvents.instance = new SendgridWebhookEvents(); }
        return SendgridWebhookEvents.instance;
    }

    // eslint-disable-next-line max-len
    on<T extends keyof SendgridWebhookCallbacks>(event: T, listener: SendgridWebhookCallbacks[T]): this { return super.on(event, listener); };
    // eslint-disable-next-line max-len
    emit<T extends keyof SendgridWebhookCallbacks>(event: T, ...args: Parameters<SendgridWebhookCallbacks[T]>) { return super.emit(event, ...args); };
};

export class SendgridWebhookDispatcher {
    constructor() {
        SendgridWebhookEvents.getInstance().on('started', () => { this.started(); });
        SendgridWebhookEvents.getInstance().on('ended', () => { this.ended(); });
        // eslint-disable-next-line no-void
        SendgridWebhookEvents.getInstance().on('dispatch', (payload) => { void this.dispatch(payload); });
        // eslint-disable-next-line no-void
        SendgridWebhookEvents.getInstance().on('processed', (...rest) => { void this.processed(...rest); });
        // eslint-disable-next-line no-void
        SendgridWebhookEvents.getInstance().on('dropped', (...rest) => { void this.dropped(...rest); });
        // eslint-disable-next-line no-void
        SendgridWebhookEvents.getInstance().on('delivered', (...rest) => { void this.delivered(...rest); });
        // eslint-disable-next-line no-void
        SendgridWebhookEvents.getInstance().on('deferred', (...rest) => { void this.deferred(...rest); });
        // eslint-disable-next-line no-void
        SendgridWebhookEvents.getInstance().on('bounce', (...rest) => { void this.bounce(...rest); });
        // eslint-disable-next-line no-void
        SendgridWebhookEvents.getInstance().on('blocked', (...rest) => { void this.blocked(...rest); });
        // eslint-disable-next-line no-void
        SendgridWebhookEvents.getInstance().on('open', (...rest) => { void this.open(...rest); });
        // eslint-disable-next-line no-void
        SendgridWebhookEvents.getInstance().on('click', (...rest) => { void this.click(...rest); });
        // eslint-disable-next-line no-void
        SendgridWebhookEvents.getInstance().on('spamreport', (...rest) => { void this.spamreport(...rest); });
        // eslint-disable-next-line no-void
        SendgridWebhookEvents.getInstance().on('unsubscribe', (...rest) => { void this.unsubscribe(...rest); });
        // eslint-disable-next-line no-void
        SendgridWebhookEvents.getInstance().on('undefined', (...rest) => { void this.undefined(...rest); });
    };

    dispatch = async (rest) => {
        const { payload } = rest;
        const events = payload;

        VERBOSE && functions.logger.info(`Dispatch handling ${events.length} events.`);

        let count = 0;
        events.forEach(async p => {
            const { event, email } = p;
            const response = { payload: p };
            count++;

            // await addEntryByTimestamp('conversations', 'sendgrid_webhook_events', moment().format('YYYYMMDD-hhmmss'), JSON.stringify(response));
            functions.logger.info(JSON.stringify(response));

            if (event) {
                functions.logger.info(`(${count}/${events.length}) Emit:${event} re:${email}`);
                SendgridWebhookEvents.getInstance().emit(event as SendgridWebhookCallbackKeys, email, p);
            } else {
                functions.logger.info(`SendgridWebhookEvent Error, Unknown SendgridWebhook Event!`);
                SendgridWebhookEvents.getInstance().emit('error', 'Unknown Event, Flagging payload');
            }
        });
        count = 0;
    };

    started = () => { functions.logger.info(`SendgridWebhookEvents started.`); };
    ended = () => { functions.logger.info(`SendgridWebhookEvents ended.`); };

    deferred = (...rest) => {
        const [email, payload] = rest;
        functions.logger.info(`Receiving server temporarily rejected the message. Email:${email}.`);
        VERBOSE && console.log(payload);
    };

    undefined = async (...rest) => {
        const [email, payload] = rest;
        functions.logger.info(`CallbackFn: undefined. Email:${email}.`);
        VERBOSE && console.log(payload);
    };

    error = async (...rest) => {
        const [email, payload] = rest;
        functions.logger.info(`Error event callback function executed. Email:${email}.`);
        // await addEntryByCategory('configuration', 'sendgrid_events', 'error', email);
        VERBOSE && console.log(payload);
    };

    processed = async (...rest) => {
        const [email, payload] = rest;
        functions.logger.info(`Message has been received and is ready to be delivered...Email:${email}.`);
        // await addEntryByCategory('configuration', 'sendgrid_events', 'processed', email);
        VERBOSE && console.log(payload);
    };

    dropped = async (...rest) => {
        const [email, payload] = rest;
        functions.logger.info(`Invalid SMTPAPI header, Spam Content (if Spam Checker app is enabled), ` +
            `Unsubscribed Address, Bounced Address, Spam Reporting Address, Invalid, Recipient List over Package Quota`);
        functions.logger.info(`Dropped. Email:${email}.`);
        // await addEntryByCategory('configuration', 'sendgrid_events', 'dropped', email);
        VERBOSE && console.log(payload);
    };

    blocked = async (...rest) => {
        const [email, payload] = rest;
        functions.logger.error(`Receiving server could not or would not accept the message temporarily. ` +
            `If a recipient has previously unsubscribed from your emails, the message is dropped. Email:${email}.`);
        // await addEntryByCategory('configuration', 'sendgrid_events', 'blocked', email);
        VERBOSE && console.log(payload);
    };

    bounce = async (...rest) => {
        const [email, payload] = rest;
        functions.logger.info(`Receiving server could not or would not accept mail to this recipient permanently. ` +
            `If a recipient has previously unsubscribed from your emails, the message is dropped. Email:${email}.`);
        // await addEntryByCategory('configuration', 'sendgrid_events', 'bounce', email);
        VERBOSE && console.log(payload);
    };

    spamreport = async (...rest) => {
        const [email, payload] = rest;
        functions.logger.info(`Spamreport event callback function executed. Email:${email}.`);
        // await addEntryByCategory('configuration', 'sendgrid_events', 'spamreport', email);
        VERBOSE && console.log(payload);
    };

    unsubscribe = async (...rest) => {
        const [email, payload] = rest;
        functions.logger.info(`Unsubscribe event callback function executed. Email:${email}.`);
        // await addEntryByCategory('configuration', 'sendgrid_events', 'unsubscribe', email);
        VERBOSE && console.log(payload);
    };

    delivered = (...rest) => {
        const [email, payload] = rest;
        functions.logger.info(`Message has been successfully delivered to the receiving server. Email:${email}.`);
        VERBOSE && console.log(payload);
    };

    open = async (...rest) => {
        const [email, payload] = rest;
        functions.logger.info(`Open event callback function executed. Email:${email}.`);
        // await addEntryByCategory('configuration', 'sendgrid_events', 'open', email);
        VERBOSE && console.log(payload);
    };

    click = async (...rest) => {
        const [email, payload] = rest;
        functions.logger.info(`Click event callback function executed. Email:${email}.`);
        // await addEntryByCategory('configuration', 'sendgrid_events', 'click', email);
        VERBOSE && console.log(payload);
    };
};
export class SendgridWebhook {
    private static instance: SendgridWebhook;
    event: SendgridWebhookEvents;
    dispatch: SendgridWebhookDispatcher;

    constructor() {
        this.event = new SendgridWebhookEvents();
        this.dispatch = new SendgridWebhookDispatcher();
    };

    public static getInstance = () => {
        if (!SendgridWebhook.instance) SendgridWebhook.instance = new SendgridWebhook();
        return SendgridWebhook.instance;
    }
};

(async () => {
    const thisFileName = __filename.split('/')[__filename.split('/').length - 1];
    functions.logger.info(`${moment().format('YYYYMMDD-hhmmssSS')} ${thisFileName}...`);

    new SendgridWebhook();
    const eventType: SendgridWebhookCallbackKeys = 'undefined';
    SendgridWebhookEvents.getInstance().emit(eventType);
});
