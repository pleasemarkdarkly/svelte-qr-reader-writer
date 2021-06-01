import * as moment from 'moment';
import * as functions from 'firebase-functions';
import * as natural from 'natural';
import { menu } from './menu';
import { health } from '../common/health';
import { Router } from 'express';
import { BLANK, convertE164 } from '../../../utils';
import { forwardSMSToEmail } from './forward';
import { selectMenuCommand } from './commands';
import {
  SLACK_CHANNEL,
  SendSlackMessage,
  SlackInstrument
} from '../../../slack';
import MessagingResponse = require('twilio/lib/twiml/MessagingResponse');
import { addEntryByTimestamp, } from '../../../utils';
import { DEVELOPER_PHONE, fireapp } from '../../../firebase';

export const router = Router();

export const ConsoleLogResponse = (req: any) => {
  if (req.body !== undefined) {
    functions.logger.info(
      `req.body:${JSON.stringify(req.body)}`, {
      structuredData: true,
    });
    functions.logger.info(
      `functions.config:${JSON.stringify(functions.config)}`, {
      structuredData: true,
    });
  }
};

router.get('/sms', async (req, res) => {
  res.send(health());
});

router.post('/sms', async (req, res) => {
  const { From, FromCity, FromState, NumMedia } = req.body;
  let twimlResponse = {};
  let command: string = BLANK;
  // await addEntryActiveSMSConversation('conversations', 'twilio_active', new Date(), convertE164(From));
  try {
    if (parseInt(NumMedia) >= 1) {
      // mms  
      twimlResponse = await forwardSMSToEmail(req);
      await addEntryByTimestamp('conversation', 'sendgrid_mms_forward', moment().format('YYYYMMDD-hhmmss'), JSON.stringify(twimlResponse));
      const twiml = new MessagingResponse();
      const mms_response = `You sent ${NumMedia} attachments(s). ` +
        `Forwarding to an Attendant who will be in touch within 24 hours.`;
      twimlResponse = await twiml.message(mms_response.toString());
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml.toString());
    } else if (parseInt(NumMedia) === 0) {
      const message = req.body?.Body;
      if (message.toLowerCase() === 'yes') {
        command = message.toLowerCase();
        await selectMenuCommand(res, req, command);
      }
      const tokenizer = new natural.WordTokenizer();
      const tokenized = tokenizer.tokenize(message);
      tokenized.forEach(token => {
        menu.forEach(async cmd => {
          if (token.toLowerCase() === cmd.toLowerCase()) {
            command = token.toLowerCase();
            await selectMenuCommand(res, req, command);
          }
        });
      });
      if (command === BLANK) {
        await SendSlackMessage(SLACK_CHANNEL.SMS_MMS, `${message} ` +
          `(${From}, ${FromCity}, ${FromState})`);

        if (From !== DEVELOPER_PHONE) { // ignore writing to fir
          const entry = {
            date: new Date(),
            mobile: convertE164(From),
            inboundOrOutbound: 'inbound',
            smsOrEmail: 'sms',
            content: message,
            humanParseNeeded: true,
          };

          await fireapp
            .firestore()
            .collection('sms')
            .doc()
            .set(entry);
        }

        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end();
      }
    }
  } catch (e) {
    functions.logger.error(e);
    const notify = new SlackInstrument(`Error occurred processing Twilio endpoint/sms.`);
    await notify.add(`TWIML State:${JSON.stringify(twimlResponse)}, ERROR:${JSON.stringify(e)}`);
    await notify.add(`req.body:${JSON.stringify(req.body)}`);
    await notify.add(`${convertE164(req.body.From)} was notified of this issue and to try again.`);
    await notify.send(SLACK_CHANNEL.DEBUG);
  }
});
