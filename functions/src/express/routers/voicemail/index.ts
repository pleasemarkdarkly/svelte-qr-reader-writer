import * as functions from 'firebase-functions';
import { Router } from 'express';
import { convertPhoneToSpeech } from '../common';
import {
  TWILIO_VOICE,
  TWILIO_VOICE_COUNTRY,
  VOICEMAIL_FULL,
  EXTERNAL_VOICEMAIL_PART_ONE,
  EXTERNAL_VOICEMAIL_PART_TWO,
  FORWARDING_NUMBER_ONE,
} from '../../../firebase/config';
import VoiceResponse = require('twilio/lib/twiml/VoiceResponse');

export const router = Router();

router.get('/voicemail', (req: any, res: any) => {
  functions.logger.info('GET /voicemail', req.body);
  const response = new VoiceResponse();
  response.play({ loop: 1 }, VOICEMAIL_FULL);
  res.set('Content-Type', 'text/xml');
  return res.send(response.toString());
});

router.post('/voicemail-mobile', (req: any, res: any) => {
  functions.logger.info('POST /voicemail', req.body);
  const response = new VoiceResponse();
  response.play({ loop: 1 }, VOICEMAIL_FULL);
  res.set('Content-Type', 'text/xml');
  return res.send(response.toString());
});

router.post('/voicemail-office', (req: any, res: any) => {
  functions.logger.info('POST /voicemail', req.body);
  const response = new VoiceResponse();
  response.play({ loop: 1 }, EXTERNAL_VOICEMAIL_PART_ONE);
  const phone = '+' + FORWARDING_NUMBER_ONE.replace(/\D/g, '');
  const transcript = convertPhoneToSpeech(phone)?.toString();
  response.say({
    voice: TWILIO_VOICE, language: TWILIO_VOICE_COUNTRY,
  }, ',' + transcript);
  response.play({ loop: 1 }, EXTERNAL_VOICEMAIL_PART_TWO);
  res.set('Content-Type', 'text/xml');
  return res.send(response.toString());
});
