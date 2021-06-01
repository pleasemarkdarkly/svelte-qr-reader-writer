import * as functions from 'firebase-functions';
import { Router } from 'express';
import { TwilioWebhook, TwilioWebhookEvents } from './events';

export const router = Router();
// eslint-disable-next-line no-void
void (async () => { new TwilioWebhook(); })();

router.get('/twilio', (req, res) => {
    const health_check = {
        uptime: process.uptime(),
        path: '/twilio',
        message: 'OK',
        timestamp: Date.now(),
    };
    res.send(health_check);
});

router.post('/twilio-pre-events', async (req, res) => {
    try {
        functions.logger.info(`/twilio-pre-events => ` +
            `req.body:${JSON.stringify(req.body.toString())}`);
        const { EventType, ChannelSid, Body, Attributes, From } = req.body;
        functions.logger.info(`/twilio-pre-events, ` +
            `EventType:${EventType},` +
            `ChannelSid: ${ChannelSid},` +
            `Body: ${Body},` +
            `Attributes: ${Attributes},` +
            `From: ${From},`
        );

        res.status(200).send({
            success: true, data:
                `${JSON.stringify(req.body)}`
        });
    } catch (e) {
        functions.logger.error(e);
        res.status(400).send(e);
    }
});

router.post('/twilio-post-events', async (req, res) => {
    try {

        functions.logger.info(`/twilio-post-events => ` +
            `req.body:${JSON.stringify(req.body.toString())}`);
        res.status(200);

    } catch (e) {
        functions.logger.error(e);
        res.status(400).send(e);
    }
    res.end();
});


router.post('/twilio-errors', async (req, res) => {
    try {
        const payload = req?.body ?? undefined;
        functions.logger.info(`/twilio-errors, ${JSON.stringify(payload)}`);
        TwilioWebhookEvents.getInstance().emit('dispatch', payload);

        res.status(200);
    } catch (e) {
        functions.logger.error(e);
        res.status(400);
    }
    res.end();
});
