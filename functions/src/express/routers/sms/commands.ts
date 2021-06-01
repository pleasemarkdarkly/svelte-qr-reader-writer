import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { menu } from './menu';
// import { setMobileSMSToOptOut } from '../../../tasks/actions';
import {
  BLANK,
  convertE164,
  addEntryByTimestamp,
  // stripPlusOne
} from '../../../utils';
import { SLACK_CHANNEL, SendSlackMessage } from '../../../slack';
import { FIREBASE_ENDPOINT } from '../../../firebase/fireapp';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER_ONE } from '../../../firebase';
import MessagingResponse = require('twilio/lib/twiml/MessagingResponse');

const twimlClient = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const smsCmd = () => {
  const menuArray = menu.toString().replace(/,/gi, ', ').replace('[', '').replace(']', '').trim();
  let cmdResponse = `Keywords include ${JSON.stringify(menuArray)}`;
  return cmdResponse = cmdResponse.toString().replace(/\"/gi, '').trim();
}

export const selectMenuCommand = async (res: any, req: any, cmd: string) => {
  let transcript = BLANK;
  const twimlMessage = new MessagingResponse();
  const { From, Body, FromCity, FromState } = req.body;
  switch (cmd) {
    case 'yes':
      break;
      if (Body.toLowerCase() === 'yes') {
        // await addEntryByTimestamp('conversations', 'twilio_yes', moment().format('YYYYMMDD-hhmmss'), convertE164(From));
        const responseMessage = ``;
        twimlMessage.message(responseMessage.toString());
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twimlMessage.toString());
      }
      break;
    case 'call':
      const callOptions = {
        from: TWILIO_NUMBER_ONE,
        to: From,
        url: FIREBASE_ENDPOINT + '/voice',
      };
      twimlClient.calls
        .create(callOptions)
        .then(call => {
          functions.logger.info(`/sms request to bridge ${convertE164(From)}`);
        })
        .finally(async () => {
          await addEntryByTimestamp('conversations', 'twilio_sms_call', moment().format('YYYYMMDD-hhmmss'), convertE164(From));
          res.writeHead(200, { 'Content-Type': 'text/xml' });
          res.end(twimlMessage.toString());
        });
      break;    
    case 'advisor':
      transcript = `An advisor will follow up with you before end of day.`;
      if (Body.toLowerCase() === 'help' || Body.toLowerCase() === 'advisor')
        await SendSlackMessage(SLACK_CHANNEL.SMS_MMS, `${Body} (${From}, ${FromCity}, ${FromState})`);      
      twimlMessage.message(transcript.toString());
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twimlMessage.toString());
      break;
    case 'schedule':
      const appMsg = 'Schedule a phone call with the following url. ..';
      // await addEntryByTimestamp('conversations', 'twilio_sms_schedule', moment().format('YYYYMMDD-hhmmss'), convertE164(From));
      twimlMessage.message(appMsg.toString());
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twimlMessage.toString());
      break;
    case 'menu':
      const cmdMsg = smsCmd();
      twimlMessage.message(cmdMsg.toString());
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twimlMessage.toString());
      break;
    case 'brochure':
      const docMsg = 'Free brochure from this url. ...';
      // await addEntryByTimestamp('conversations', 'twilio_sms_brochure', moment().format('YYYYMMDD-hhmmss'), convertE164(From));
      twimlMessage.message(docMsg.toString());
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twimlMessage.toString());
      break;
    case 'fwd':
      await SendSlackMessage(SLACK_CHANNEL.SMS_MMS, `${Body} (${From}, ${FromCity}, ${FromState})`);
      res.end();
      break;
    case 'optout':
      transcript = `The number ${From} ` +
        `has been removed from future calling attempts, Goodbye `;
      // await setMobileSMSToOptOut({ address: From });
      twimlMessage.message(transcript.toString());
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twimlMessage.toString());
      break;
    default:
      break;
  }
};
