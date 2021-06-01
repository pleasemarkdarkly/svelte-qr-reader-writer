// import * as moment from 'moment';
import * as functions from 'firebase-functions';
import { FIREBASE_ENDPOINT } from '../../../firebase/fireapp';
import {
  TWILIO_VOICE,
  TWILIO_VOICE_COUNTRY,
  FORWARDING_NUMBER_ONE,
  FORWARDING_NUMBER_TWO,
} from '../../../firebase/config';
import {
  sendSMS,
  convertPhoneToSpeech,
  AttendantPhoneSchedule,
  MENU_NAVIGATION,
  RETURN_TO_MENU,
  ENROLL_OFFERS,
  DRIVING_DIRECTIONS,
  TRANSFER_X,
  TRANSFER_Y,
} from '../common';
import { OPTOUT_PRESS_NINE } from '../../../firebase';
import { SlackInstrument, SLACK_CHANNEL } from '../../../slack';
import { convertE164, } from '../../../utils';
import { setMobileSMSToOffers } from '../../../tasks';

const VoiceResponse = require('twilio').twiml.VoiceResponse;

export const redirectWelcome = (req: any, res: any) => {
  const twiml = new VoiceResponse();
  try {
    twiml.say(RETURN_TO_MENU, { voice: TWILIO_VOICE, language: TWILIO_VOICE_COUNTRY, });
  } catch (e) {
    functions.logger.error(e);
    res.send(e);
  }
  twiml.redirect(FIREBASE_ENDPOINT + '/inbound');
  res.send(twiml.toString());
};

export const welcome = (req: any, res: any) => {
  const voiceResponse = new VoiceResponse();
  try {
    const gather = voiceResponse.gather({
      action: FIREBASE_ENDPOINT + '/inbound',
      numDigits: '1',
      method: 'POST',
    });
    gather.say(MENU_NAVIGATION, { voice: TWILIO_VOICE, language: TWILIO_VOICE_COUNTRY, });
    gather.play({ loop: 1 }, OPTOUT_PRESS_NINE);
    // gather.play({ loop: 3 }, IVR_MENU);
  } catch (e) {
    functions.logger.error(e);
    res.send(e);
  }
  res.send(voiceResponse.toString());
};

export const drivingDirections = async (req: any, res: any) => {
  const { To, From } = req?.body;
  const message = 'Put location information and links here';
  const twiml = new VoiceResponse();
  try {
    twiml.say(DRIVING_DIRECTIONS, {
      voice: TWILIO_VOICE,
      language: TWILIO_VOICE_COUNTRY,
    });
    await sendSMS(To, From, message);
  } catch (e) {
    functions.logger.error(e);
    res.send(e);
  }
  twiml.redirect(FIREBASE_ENDPOINT + '/inbound');
  res.send(twiml.toString());
};

export const transferBellevue = async (req: any, res: any) => {
  const { From } = req?.body;
  const FromE164 = convertE164(From);
  const twiml = new VoiceResponse();
  try {
    functions.logger.info(`Fowarding ${FromE164} to location X`);    
    twiml.say(TRANSFER_X, {
      voice: TWILIO_VOICE,
      language: TWILIO_VOICE_COUNTRY,
    });
  } catch (e) {
    functions.logger.error(e);
    res.send(e);
  }
  twiml.dial(FORWARDING_NUMBER_ONE);
  res.send(twiml.toString());
};

export const transferNorthgate = async (req: any, res: any) => {
  const { From } = req?.body;
  const FromE164 = convertE164(From);
  const twiml = new VoiceResponse();
  try {
    functions.logger.info(`Fowarding ${FromE164} to Location B`);    
    twiml.say(TRANSFER_Y, {
      voice: TWILIO_VOICE,
      language: TWILIO_VOICE_COUNTRY,
    });
  } catch (e) {
    functions.logger.error(e);
    res.send(e);
  }
  twiml.dial(FORWARDING_NUMBER_ONE);
  res.send(twiml.toString());
};

export const enrollOffers = async (req: any, res: any) => {
  const { From } = req?.body;
  const twiml = new VoiceResponse();
  try {
    twiml.say(ENROLL_OFFERS, {
      voice: TWILIO_VOICE,
      language: TWILIO_VOICE_COUNTRY,
    });
    await setMobileSMSToOffers({ address: From });
  } catch (e) {
    functions.logger.error(e);
    res.send(e);
  }
  twiml.redirect(FIREBASE_ENDPOINT + '/inbound');
  res.send(twiml.toString());
};

export const appointment = async (req: any, res: any) => {
  const { To, From } = req?.body;
  const transcript = 'Appointment option selected...';
  const message = 'Add appointment link here';
  const twiml = new VoiceResponse();
  try {
    twiml.say(transcript, {
      voice: TWILIO_VOICE,
      language: TWILIO_VOICE_COUNTRY,
    });
    await sendSMS(To, From, message);
  } catch (e) {
    functions.logger.error(e);
    res.send(e);
  }
  twiml.redirect(FIREBASE_ENDPOINT + '/inbound');
  res.send(twiml.toString());
};

export const advisor = async (req: any, res: any) => {
  const { From } = req?.body;
  const FromE164 = convertE164(From);
  const transcript = 'Advisor menu option selected...transferring...';
  const twiml = new VoiceResponse();
  try {
    const notify = new SlackInstrument(`Incoming call from:${FromE164}`);
    await notify.add(`${From} requested IVR transfer to an Advisor routing to ${AttendantPhoneSchedule()}`);
    await notify.send(SLACK_CHANNEL.SMS_MMS);
    twiml.say(transcript, {
      voice: TWILIO_VOICE,
      language: TWILIO_VOICE_COUNTRY,
    });
    // await addEntryByTimestamp('conversations', 'twilio_advisor_forward', moment().format('YYYYMMDD-hhmmss'), FromE164);
  } catch (e) {
    functions.logger.error(e);
    res.send(e);
  }
  twiml.dial(FORWARDING_NUMBER_TWO);
  res.send(twiml.toString());
};

export const requestInformation = async (req: any, res: any) => {
  const { To, From } = req?.body;
  const transcript = `Information requested was texted to ${convertPhoneToSpeech(From)}.`;
  try {
    const twiml = new VoiceResponse();
    twiml.say(transcript, {
      voice: TWILIO_VOICE,
      language: TWILIO_VOICE_COUNTRY,
    });
    const message = 'Add some link to useful information here';
    await sendSMS(To, From, message);
    twiml.redirect(FIREBASE_ENDPOINT + '/inbound');
    res.send(twiml.toString());
  } catch (e) { functions.logger.error(e); }
};

// Debugging, helper to listen to recorded content
export const listenVoicemail = async (req: any, res: any) => {
  const transcript = `Playing updated voicemail:`;
  try {
    const twiml = new VoiceResponse();
    twiml.say(transcript, { voice: TWILIO_VOICE, language: TWILIO_VOICE_COUNTRY, });
    twiml.redirect(FIREBASE_ENDPOINT + '/voicemail-office');
    res.send(twiml.toString());
  } catch (e) {
    functions.logger.error(e);
  }
};
