# Sendgrid Webhook Event Handler
Sendgrid Webhook for processing events. `Filter` and `handler` were for previously logged but not acted upon events, before being replaced by `events` which processed/emits events upon receipt of Sendgrid Webhook events. While not clean and terse, this note provides historical reference. 

## Class design
The eventing design was abstracted from a common pattern in this application, so that the logic could be broken up in manageable file length. The following I created for express routes. 

```typescript
import * as EventEmitter from 'events';
import * as functions from 'firebase-functions';

interface ExampleCallbacks {
    'started': () => void;
    'timeout': () => void;
    'senddata': (data) => void;
    'ended': () => void;
};

export class ExampleEvents extends EventEmitter {
    private static instance: ExampleEvents;

    constructor() { super(); };
    static getInstance = () => {
        if (!ExampleEvents.instance) { ExampleEvents.instance = new ExampleEvents(); }
        return ExampleEvents.instance;
    }

    on<T extends keyof ExampleCallbacks>(event: T, listener: ExampleCallbacks[T]): this { return super.on(event, listener); };
    emit<T extends keyof ExampleCallbacks>(event: T, ...args: Parameters<ExampleCallbacks[T]>) { return super.emit(event, ...args); };
};

export class ExampleDispatcher {
    constructor() {
        ExampleEvents.getInstance().on('started', () => { this.started(); });
        ExampleEvents.getInstance().on('timeout', () => { this.timeout(); });
        ExampleEvents.getInstance().on('senddata', (data) => { this.senddata(data); });
        ExampleEvents.getInstance().on('ended', () => { this.ended(); });
    };

    started = () => { functions.logger.info(`CallbackFn: started.`); };
    ended = () => { functions.logger.info(`CallbackFn: ended.`); };
    senddata = (data) => { functions.logger.info(`CallbackFn: senddata. data:`); console.log(data); };
    timeout = () => { functions.logger.info(`CallbackFn: timeout.`); };
};

export class Selection {
    exampleEvents: ExampleEvents;
    exampleDispatcher: ExampleDispatcher;
    constructor() {
        this.exampleEvents = new ExampleEvents();
        this.exampleDispatcher = new ExampleDispatcher();
    };
};


(async () => {

    new Selection();
    ExampleEvents.getInstance().emit('started');
    ExampleEvents.getInstance().emit('timeout');
    ExampleEvents.getInstance().emit('senddata',
        { property: 'string', property_2: 12, property_3: { x: 'xyz', y: 123, z: true } });
    ExampleEvents.getInstance().emit('ended');

});
```

## Implementation
Upon implementation, adding `keyof` type for the callbacks was used for typing the dispatch entry function. From the `SendgridEvents` example:

`type SendgridWebhookCallbackKeys = keyof SendgridWebhookCallbacks;`

To keep the handler route minimal, a `dispatch` event is called, effectively handling and routing other events identified. 

```typescript
dispatch = async (rest) => {
        const { payload } = rest;
        const events = payload;

        VERBOSE && functions.logger.info(`Dispatch handling ${events.length} events.`);

        let count = 0;
        events.forEach(async p => {
            const { event: SendgridWebhookCallbackKeys, email } = p;
            const response = { payload: p };
            count++;

            await addEntryByTimestamp('conversations', 'sendgrid_webhook_events',
                moment().format('YYYYMMDD-hhmmss'), JSON.stringify(response));

            if (typeof event === 'string') {
                if (event) {
                    functions.logger.info(`(${count}/${events.length}) Emit:${event} re:${email}`);
                    SendgridWebhookEvents.getInstance().emit(event as SendgridWebhookCallbackKeys, email, p);
                } else {
                    functions.logger.info(`SendgridWebhookEvent Error, Unknown SendgridWebhook Event!`);
                    SendgridWebhookEvents.getInstance().emit('error', 'Unknown Event, Flagging payload');
                }
            }
        });
        count = 0;
    };
```

Specifically, 

```typescript
    SendgridWebhookEvents.getInstance().emit(event as SendgridWebhookCallbackKeys, email, p);
```


