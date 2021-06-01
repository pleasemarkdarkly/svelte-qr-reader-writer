import * as functions from 'firebase-functions';
import { Router } from 'express';
import { FIREBASE_ENDPOINT } from '../../../firebase/fireapp';
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_NUMBER_ONE
} from '../../../firebase/config';
import * as twilio from 'twilio';
import * as TwilioClient from 'twilio/lib/rest/Twilio';
const twiml: TwilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { logLevel: 'debug' });

export const router = Router();

router.post('/auto-dialer', async (req: any, res: any) => {
  functions.logger.info(`/auto-dialer => number:${req.body?.number}, ` +
    `Body:${JSON.stringify(req.body)}`);
  const To = req.body?.number ?? undefined;
  if (To === undefined) return res.send({ error: 'Route requires a valid phone number in the body.' });

  try {
    const callOptions = {
      machineDetection: 'DetectMessageEnd',
      asyncAMD: true,
      from: TWILIO_NUMBER_ONE,
      to: To,
      url: FIREBASE_ENDPOINT + '/questionnaire-route',
    };
    const response = new twilio.twiml.VoiceResponse();
    await twiml.calls.create(callOptions).then(e => {
      functions.logger.info(`/questionnaire callsid => ${e.sid}`);
    });
    return res.send(response.toString());
  } catch (error) {
    functions.logger.error(error);
    return res.send(error);
  }
});
