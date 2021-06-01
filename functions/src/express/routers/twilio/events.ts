import * as EventEmitter from 'events';
import * as moment from 'moment';
import * as functions from 'firebase-functions';
import { twilio_error_codes } from './error';

const addActivityByResourceSid = async (sid: string, error: string) => {
    functions.logger.info(`TODO: Add:${error} to ${sid} => Contact`);
};

export interface TwilioError {
    'ParentAccountSid': string,
    'Payload': {
        'resource_sid': string,
        'service_sid': string,
        'error_code': string,
    },
    'Level': string,
    'Timestamp': Date,
    'PayloadType': string,
    'AccountSid': string,
    'Sid': string,
    'to'?: string,
};

interface TwilioWebhookCallbacks {
    'started': () => void;
    'ended': () => void;
    'dispatch': (payload) => void;
    'undefined': (args) => void;
    'error_': (args) => void;
    'error_14107': (args) => void;
    'error_11750': (args) => void;
    'error_11200': (args) => void;
    'error_11205': (args) => void;
    'error_30008': (args) => void;
    'error_30007': (args) => void;
    'error_30003': (args) => void;
    'error': (args) => void;
};

const VERBOSE = true;
type TwilioWebhookCallbackKeys = keyof TwilioWebhookCallbacks;

export class TwilioWebhookEvents extends EventEmitter {
    private static instance: TwilioWebhookEvents;
    constructor() { super(); };

    static getInstance = () => {
        if (!TwilioWebhookEvents.instance) { TwilioWebhookEvents.instance = new TwilioWebhookEvents(); }
        return TwilioWebhookEvents.instance;
    }

    on<T extends keyof TwilioWebhookCallbacks>(event: T, listener: TwilioWebhookCallbacks[T]): this { return super.on(event, listener); };
    // eslint-disable-next-line max-len
    emit<T extends keyof TwilioWebhookCallbacks>(event: T, ...args: Parameters<TwilioWebhookCallbacks[T]>) { return super.emit(event, ...args); };
};

export class TwilioWebhookDispatcher {
    constructor() {
        TwilioWebhookEvents.getInstance().on('started', () => { this.started(); });
        TwilioWebhookEvents.getInstance().on('ended', () => { this.ended(); });

        // eslint-disable-next-line no-void
        TwilioWebhookEvents.getInstance().on('dispatch', (payload) => { void this.dispatch(payload); });
        // eslint-disable-next-line no-void
        TwilioWebhookEvents.getInstance().on('error', (args) => { void this.error(args); });
        // eslint-disable-next-line no-void
        TwilioWebhookEvents.getInstance().on('error_', (args) => { void this.error(args); });
        // eslint-disable-next-line no-void
        TwilioWebhookEvents.getInstance().on('error_14107', (args) => { void this.error_14107(args); });
        // eslint-disable-next-line no-void
        TwilioWebhookEvents.getInstance().on('error_11750', (args) => { void this.error_11750(args); });
        // eslint-disable-next-line no-void
        TwilioWebhookEvents.getInstance().on('error_11200', (args) => { void this.error_11200(args); });
        // eslint-disable-next-line no-void
        TwilioWebhookEvents.getInstance().on('error_11205', (args) => { void this.error_11205(args); });
        // eslint-disable-next-line no-void
        TwilioWebhookEvents.getInstance().on('error_30008', (args) => { void this.error_30008(args); });
        // eslint-disable-next-line no-void
        TwilioWebhookEvents.getInstance().on('error_30007', (args) => { void this.error_30007(args); });
        // eslint-disable-next-line no-void
        TwilioWebhookEvents.getInstance().on('error_30003', (args) => { void this.error_30003(args); });
        // eslint-disable-next-line no-void
        TwilioWebhookEvents.getInstance().on('undefined', (args) => { void this.undefined(args); });

    };

    started = () => { functions.logger.info(`TwilioWebhookEvents started.`); };
    ended = () => { functions.logger.info(`TwilioWebhookEvents ended.`); };

    dispatch = async (args) => {
        const { Payload, Level } = args;
        const { error_code } = Payload;
        const errorDetails = twilio_error_codes.find(e => { e.code === error_code; });

        VERBOSE && functions.logger.info(`Dispatch handling:${Level} (${error_code}).`);
        VERBOSE && console.log(args);
        VERBOSE && console.log(errorDetails);

        if (Level === 'Error') {
            try {
                TwilioWebhookEvents.getInstance().emit(`error_` + error_code as TwilioWebhookCallbackKeys, args);
            } catch (e) {
                functions.logger.error(e);
                TwilioWebhookEvents.getInstance().emit('undefined', args);
            }
        } else {
            // await addEntryByCategory('configuration', 'twilio_non_errors', Level, JSON.stringify(args));
        }
    };

    error_ = async (args) => {
        const { Payload: { resource_sid, error_code } } = args;
        // await addEntryByCategory('configuration', `twilio_error_${error_code}`, `${error_code}`, JSON.stringify(args));
        await addActivityByResourceSid(resource_sid, error_code);
        functions.logger.info(`SMS send rate limited exceeded.`);
        VERBOSE && console.log(args);
    };

    error_14107 = async (args) => {
        const { Payload: { resource_sid, error_code } } = args;
        // await addEntryByCategory('configuration', `twilio_error_${error_code}`, `${error_code}`, JSON.stringify(args));
        await addActivityByResourceSid(resource_sid, error_code);
        functions.logger.info(`SMS send rate limited exceeded.`);
        VERBOSE && console.log(args);
    };

    error_11200 = async (args) => {
        const { Payload: { resource_sid, error_code } } = args;
        // await addEntryByCategory('configuration', `twilio_error_${error_code}`, `${error_code}`, JSON.stringify(args));
        await addActivityByResourceSid(resource_sid, error_code);
        functions.logger.info(`HTTP retrieval failure.`);
        VERBOSE && console.log(args);
    };

    error_11205 = async (args) => {
        const { Payload: { resource_sid, error_code } } = args;
        // await addEntryByCategory('configuration', `twilio_error_${error_code}`, `${error_code}`, JSON.stringify(args));
        await addActivityByResourceSid(resource_sid, error_code);
        functions.logger.info(`HTTP connection failure.`);
        VERBOSE && console.log(args);
    };

    error_11750 = async (args) => {
        const { Payload: { resource_sid, error_code } } = args;
        // await addEntryByCategory('configuration', `twilio_error_${error_code}`, `${error_code}`, JSON.stringify(args));
        await addActivityByResourceSid(resource_sid, error_code);
        functions.logger.info(`TwiML response body too large.`);
        VERBOSE && console.log(args);
    };

    error_30008 = async (args) => {
        const { Payload: { resource_sid, error_code } } = args;
        // await addEntryByCategory('configuration', `twilio_error_${error_code}`, `${error_code}`, JSON.stringify(args));
        await addActivityByResourceSid(resource_sid, error_code);
        functions.logger.info(`Unknown error.`);
        VERBOSE && console.log(args);
    };

    error_30007 = async (args) => {
        const { Payload: { resource_sid, error_code } } = args;
        // await addEntryByCategory('configuration', `twilio_error_${error_code}`, `${error_code}`, JSON.stringify(args));
        await addActivityByResourceSid(resource_sid, error_code);
        functions.logger.info(`Message filter.`);
        VERBOSE && console.log(args);
    };

    error_30003 = async (args) => {
        const { Payload: { resource_sid, error_code } } = args;
        // await addEntryByCategory('configuration', `twilio_error_${error_code}`, `${error_code}`, JSON.stringify(args));
        await addActivityByResourceSid(resource_sid, error_code);
        functions.logger.info(`Unreachable destination handset.`);
        VERBOSE && console.log(args);
    };

    undefined = async (args) => {
        const { Payload: { resource_sid, error_code } } = args;
        // await addEntryByCategory('configuration', `twilio_error_${error_code}`, `${error_code}`, JSON.stringify(args));
        await addActivityByResourceSid(resource_sid, error_code);
        functions.logger.info(`Undefined/Unhandled error.`);
        VERBOSE && console.log(args);
    };

    error = async (...args) => { };
};

export class TwilioWebhook {
    private static instance: TwilioWebhook;
    event: TwilioWebhookEvents;
    dispatch: TwilioWebhookDispatcher;

    constructor() {
        this.event = new TwilioWebhookEvents();
        this.dispatch = new TwilioWebhookDispatcher();
    };

    public static getInstance = () => {
        if (!TwilioWebhook.instance) TwilioWebhook.instance = new TwilioWebhook();
        return TwilioWebhook.instance;
    }
};

(async () => {
    const thisFileName = __filename.split('/')[__filename.split('/').length - 1];
    functions.logger.info(`${moment().format('YYYYMMDD-hhmmssSS')} ${thisFileName}...`);

    new TwilioWebhook();
    const eventType: TwilioWebhookCallbackKeys = 'undefined';
    TwilioWebhookEvents.getInstance().emit(eventType, undefined);
});
