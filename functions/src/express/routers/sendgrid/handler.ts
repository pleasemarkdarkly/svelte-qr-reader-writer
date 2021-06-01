import * as functions from 'firebase-functions';
import { SendgridWebhookFilter } from './filter';

const concurrency = 8;

export const handler = async (argv?: any) => {
    const webhook = new SendgridWebhookFilter(concurrency);

    webhook.on('bounce', async (event): Promise<void> => { functions.logger.info(`🏀 - Bounce callback. ${event.email}`,); });
    webhook.on('deferred', async (event): Promise<void> => { functions.logger.info(`⚽ - Deferred callback. ${event.email}`); });
    // eslint-disable-next-line max-len
    webhook.on('dropped', async (event): Promise<void> => { functions.logger.info(`Emitted dropped triggered this callback. ${event.email}`); });
    webhook.on('unsubscribed', async (event): Promise<void> => { functions.logger.info(`🤮 📰 - Unsubscribed callback. ${event.email}`); });
    webhook.on('spamreport', async (event): Promise<void> => { functions.logger.info(`🥫 - Spamreport callback. ${event.email}`); });
    webhook.on('delivered', async (event): Promise<void> => { functions.logger.info(`📫 - Delivered callback. ${event.email}`); });
    webhook.on('open', async (event): Promise<void> => { functions.logger.info(`📨 - Open callback. ${event.email}`); });
    webhook.on('processed', async (event): Promise<void> => { functions.logger.info(`📨 - Processed callback. ${event.email}`); });
    webhook.on('click', async (event): Promise<void> => { functions.logger.info(`🖱️ - Click callback. ${event.email}`); });

    await webhook.fetchSendgridWebhookEvents();
    await webhook.debugSendgridWebhookEvents();

};

(async () => { await handler(); });
