import * as functions from 'firebase-functions';
// import * as moment from 'moment';
import { Router } from 'express';
// import { BLANK } from '../../../utils';
import {
  FIREBASE_ENDPOINT
} from '../../../firebase/fireapp';
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_NUMBER_ONE,
  FORWARDING_NUMBER_ONE,
  TWILIO_VOICE,
  TWILIO_VOICE_COUNTRY,
  EXTERNAL_VOICEMAIL_PART_ONE,
  EXTERNAL_VOICEMAIL_PART_TWO,
  OPTOUT_QUESTIONNAIRE_MENU,
  OPTOUT_APOLOGY,
  OPTOUT_REMOVED_NUMBER_CONFIRMATION,
} from '../../../firebase/config';
import {
  convertPhoneToSpeech,
  // sendSMS
} from '../common';
import { SLACK_CHANNEL, SlackInstrument } from '../../../slack';
import * as twilio from 'twilio';
import * as TwilioClient from 'twilio/lib/rest/Twilio';

const twiml: TwilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { logLevel: 'debug' });
// const VoiceResponse = require('twilio').twiml.VoiceResponse;

export const router = Router();

router.post('/questionnaire', async (req: any, res: any) => {
  functions.logger.info(`/questionnaire => number:${req.body?.number}, Body:${JSON.stringify(req.body)}`);
  const To = req.body?.number ?? undefined;
  if (To === undefined) {
    res.send({ error: 'Route requires a valid phone number in the body.' });
  }
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

export const introduction = async (req: any, res: any) => {
  const response = new twilio.twiml.VoiceResponse();
  const gather = response.gather({
    action: FIREBASE_ENDPOINT + '/questionnaire-responses',
    numDigits: 1, method: 'POST',
  });
  gather.play({ loop: 2 }, OPTOUT_QUESTIONNAIRE_MENU);
  res.send(response.toString());
};

router.post('/questionnaire-menu', async (req: any, res: any) => {
  return await introduction(req, res);
});

router.post('/questionnaire-route', async (req: any, res: any) => {
  functions.logger.info(`/questionnaire-route => req.body:${JSON.stringify(req.body)} ` +
    `answeredBy:${req.body?.AnsweredBy}`);
  const { To } = req.body;
  functions.logger.info(`${To}`);
  const response = new twilio.twiml.VoiceResponse();
  switch (req.body?.AnsweredBy) {
    case 'human':
      functions.logger.info('switch: human, redirect');
      // await addEntryByTimestamp('conversations', 'twilio_autodialer_human', moment().format('YYYYMMDD-hhmmss'), convertE164(To));
      response.redirect(FIREBASE_ENDPOINT + '/questionnaire-menu');
      res.send(response.toString());
      break;
    case 'unknown':
      functions.logger.info('switch: unknown');
      // await addEntryByTimestamp('conversations', 'twilio_autodialer_unknown', moment().format('YYYYMMDD-hhmmss'), convertE164(To));
      response.redirect(FIREBASE_ENDPOINT + '/questionnaire-menu');
      res.send(response.toString());
      break;
    case 'machine_end_beep':
      functions.logger.info('switch: machine_end_beep');
      // await addEntryByTimestamp('conversations', 'twilio_autodialer_machine_end_beep', moment().format('YYYYMMDD-hhmmss'), convertE164(To));
      response.play({ loop: 1 }, EXTERNAL_VOICEMAIL_PART_ONE);
      const phone = '+' + FORWARDING_NUMBER_ONE.replace(/\D/g, '');
      const transcript = convertPhoneToSpeech(phone)?.toString();
      response.say({
        voice: TWILIO_VOICE, language: TWILIO_VOICE_COUNTRY,
      }, ',' + transcript);
      response.play({ loop: 1 }, EXTERNAL_VOICEMAIL_PART_TWO);
      res.set('Content-Type', 'text/xml');
      return res.send(response.toString());
    case 'machine_start':
      functions.logger.info('switch: machine_start');
    // await addEntryByTimestamp('conversations', 'twilio_autodialer_machine_start', moment().format('YYYYMMDD-hhmmss'), convertE164(To));
    case 'machine_end_silence':
      functions.logger.info('switch: machine_end_silence');
    // await addEntryByTimestamp('conversations', 'twilio_autodialer_machine_end_silence', moment().format('YYYYMMDD-hhmmss'), convertE164(To));
    case 'machine_end_other':
      functions.logger.info('switch: machine_end_other');
    // await addEntryByTimestamp('conversations', 'twilio_autodialer_machine_end_other', moment().format('YYYYMMDD-hhmmss'), convertE164(To));
    case 'fax':
      functions.logger.info('switch: fax');
      // await addEntryByTimestamp('conversations', 'twilio_autodialer_fax', moment().format('YYYYMMDD-hhmmss'), convertE164(To));
      response.hangup();
      res.send(response.toString());
      break;
    default:
      functions.logger.info('switch: default');
  }
});

router.post('/questionnaire-responses', async (req: any, res: any) => {
  const { To, Digits } = req.body;
  functions.logger.info(`/questionnaire-responses, ` +
    `Digits:${req.body?.Digits}, To:${To}, Body:${JSON.stringify(req.body)}`);
  const response = new twilio.twiml.VoiceResponse();
  const notify = new SlackInstrument(`Auto-Dialer`);
  let transcript = 'Connecting you to an advisor...';
  if (!Digits) {
    functions.logger.warn(`'/questionnaire-responses, Digits undefined:${Digits}`);
    await introduction(req, res);
  } else {
    switch (Digits) {
      case '1':
        functions.logger.info(`Digits:${Digits}, ` +
          `Confirmation of desirable choice A and request to transfer to a person`);
        // await addEntryByTimestamp('conversations', 'twilio_autodialer_confirmed-choice-A', moment().format('YYYYMMDD-hhmmss'), convertE164(To));
        transcript = `Connecting you to an Advisor,`;
        response.say({ voice: TWILIO_VOICE, language: TWILIO_VOICE_COUNTRY }, transcript);
        response.dial(FORWARDING_NUMBER_ONE);
        await notify.add(`${To} is requesting to speak with an advisor, routing call now...`);
        await notify.send(SLACK_CHANNEL.SMS_MMS);
        return res.send(response.toString());
      case '2':
        functions.logger.info(`Digits:${Digits}, Confirmed undesirable choice B.`);
        // await addEntryByTimestamp('conversations', 'twilio_autodialer_confirmed-choice-B', moment().format('YYYYMMDD-hhmmss'), convertE164(To));
        transcript = `Your selection has been recorded. Thank you. `;
        response.say({ voice: TWILIO_VOICE, language: TWILIO_VOICE_COUNTRY }, transcript);
        return res.send(response.toString());
      case '3':
        functions.logger.info(`Digits:${Digits}, Confirmation of choice C.`);
        // await addEntryByTimestamp('conversations', 'twilio_autodialer_confirmed-choice-C', moment().format('YYYYMMDD-hhmmss'), convertE164(To));
        transcript = `Your selection has been recorded. Thank you.`;
        response.say({ voice: TWILIO_VOICE, language: TWILIO_VOICE_COUNTRY }, transcript);
        return res.send(response.toString());
      case '4':
        functions.logger.info(`Digits:${Digits}, ` +
          `Look-up accident by phone number:${To}`);
      case '5':
        functions.logger.info(`Digits:${Digits}, Transferring to an advisor...${FORWARDING_NUMBER_ONE}`);
        transcript = 'Connecting you to an advisor..';
        response.say({ voice: TWILIO_VOICE, language: TWILIO_VOICE_COUNTRY }, transcript);
        response.dial(FORWARDING_NUMBER_ONE);
        return res.send(response.toString());
      case '6':
        transcript = 'Searching for an advisor to help you, ...';
        response.say({ voice: TWILIO_VOICE, language: TWILIO_VOICE_COUNTRY }, transcript);
        response.dial(FORWARDING_NUMBER_ONE);
        return res.send(response.toString());
      case '9':
        functions.logger.info(`Digits:${Digits}, optOut, removing ${To} from future call lists...`);
        transcript = `Opt-out selected, The number ${convertPhoneToSpeech(To,)} ` +
          `has been removed from future contact, Goodbye `;
        // await addEntryByTimestamp('conversations', 'twilio_autodialer_optout', moment().format('YYYYMMDD-hhmmss'), convertE164(To));
        // response.say({ voice: TWILIO_VOICE, language: TWILIO_VOICE_COUNTRY }, transcript);
        response.play({ loop: 1 }, OPTOUT_APOLOGY);
        response.pause();
        response.play({ loop: 1 }, OPTOUT_REMOVED_NUMBER_CONFIRMATION);
        return res.send(response.toString());
      case '7': functions.logger.warn(`case (${Digits}), Unimplemented.`);
      case '8': functions.logger.warn(`case (${Digits}), Unimplemented.`);
      default:
        functions.logger.warn(`/questionnaire-responses, default, replay introduction`);
        await introduction(req, res);
    }
    functions.logger.warn(`/questionnaire-responses, switch-exit, replay introduction`);
    await introduction(req, res);
  }
});
