const VoiceResponse = require('twilio').twiml.VoiceResponse;
import { OPTOUT_REMOVED_NUMBER_CONFIRMATION, TWILIO_VOICE, TWILIO_VOICE_COUNTRY } from '../../../firebase';
import { convertPhoneToSpeech } from '../common';
import { setMobileSMSToOptOut } from '../../../tasks';

export const optOut = async (req: any, res: any) => {
  const { From } = req.body;
  const transcript = 'Opt-out selected.' +
    `The number ${convertPhoneToSpeech(From)} ` +
    `has opted out of future contact, Goodbye `;

  await setMobileSMSToOptOut({ address: From });
  const twiml = new VoiceResponse();

  twiml.say(transcript, {
    voice: TWILIO_VOICE,
    language: TWILIO_VOICE_COUNTRY,
  });

  twiml.hangup();
  res.send(twiml.toString());
};

export const optOut_recording = async (req: any, res: any) => {
  const { From } = req.body;
  console.log(`From:${From}`);
  await setMobileSMSToOptOut({ address: From });
  const twiml = new VoiceResponse();
  twiml.play({ loop: 1 }, OPTOUT_REMOVED_NUMBER_CONFIRMATION);
  twiml.hangup();
  res.send(twiml.toString());
};
