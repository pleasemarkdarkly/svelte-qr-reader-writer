import * as moment from 'moment';
import * as functions from 'firebase-functions';
import { Router } from 'express';
import { FORWARDING_NUMBER_ONE } from '../../../firebase/config';
import { addEntryByTimestamp, convertE164 } from '../../../utils';
import { SLACK_CHANNEL, SlackInstrument } from '../../../slack';
import VoiceResponse = require('twilio/lib/twiml/VoiceResponse');

export const router = Router();

router.get('/voice', (req: any, res: any) => {
  functions.logger.info('/voice', req.body);
  const health_check = {
    uptime: process.uptime(),
    path: '/voice',
    message: 'OK',
    timestamp: Date.now(),
  };
  return res.send(health_check);
});

router.post('/voice', async (req: any, res: any) => {
  try {
    const { To, From } = req?.body;
    const notify = new SlackInstrument(`Call started to Attendant...`);
    await notify.add(`Bridging call with ${convertE164(From)} and ${convertE164(To)}`);
    await notify.send(SLACK_CHANNEL.SMS_MMS);
    await addEntryByTimestamp('conversations', 'twilio_voice_call', moment().format('YYYYMMHH-hhmmss'), convertE164(To));
  } catch (e) { functions.logger.error(e); }
  const response = new VoiceResponse();
  response.dial(FORWARDING_NUMBER_ONE);
  res.set('Content-Type', 'text/xml');
  return res.send(response.toString());
});
