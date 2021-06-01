import * as functions from 'firebase-functions';
import { Router } from 'express';
import { SendgridWebhook, SendgridWebhookEvents } from './events';

export const router = Router();
// eslint-disable-next-line no-void
void (async () => { new SendgridWebhook(); })();

router.get('/sendgrid', (req, res) => {
  const health_check = {
    uptime: process.uptime(),
    path: '/sendgrid',
    message: 'OK',
    timestamp: Date.now(),
  };
  res.send(health_check);
});

router.post('/sendgrid-events', async (req, res) => {
  try {
    const payload = req?.body ?? undefined;
    const event = payload.event ?? undefined;
    const email = payload.email ?? undefined;
    const response = { email: email, event: event, payload: payload };
    SendgridWebhookEvents.getInstance().emit('dispatch', response);
    res.status(200).send({ success: true, data: `${JSON.stringify(req?.body)}` });
  } catch (e) {
    functions.logger.error(e)
    res.status(400).send(e);
  }
  res.end();
});

router.post('/sendgrid-inbound-parse', async (req, res) => {
  try {
    functions.logger.info(`/sendgrid-inbound-parse => ` +
      `req.body:${JSON.stringify(req?.body.toString())}`);
    res.status(200).send({ success: true, data: `${JSON.stringify(req?.body)}` });
  } catch (e) {
    functions.logger.error(e)
    res.status(400).send(e);
  }
  res.end();
});
