import { Router } from 'express';
import * as functions from 'firebase-functions';
import { phoneFormatE164, formatDateTime, compactLoggingTime, convertUTCDateToLocalDate } from '../../../utils';
// import { SLACK_CHANNEL, SendSlackMessage } from '../../../slack';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER_ONE } from '../../../firebase';

export const router = Router();

router.get('/slack', (req, res) => {
  const health_check = {
    uptime: process.uptime(),
    path: '/slack',
    message: 'OK',
    timestamp: Date.now(),
    convertUTCToLocal: convertUTCDateToLocalDate(new Date()),
    compactLoggingTime: compactLoggingTime(), // UTC
    formatedDateTime: formatDateTime(new Date()),
  };
  res.send(health_check);
});

router.post('/slack-challenge', async (req, res) => {
  const { challenge } = req.body;
  functions.logger.info(`/slack-challenge => req.body.challenge:${challenge}`);
  res.send({ challenge })
});

router.post('/slack', async (req, res) => {
  functions.logger.info(`/slack => req.body:${JSON.stringify(req.body)}`);
  const { command, text } = req.body;

  //await SendSlackMessage(SLACK_CHANNEL.DEBUG, `command:${command}, text:${text},\n` +
  //  `original:${JSON.stringify(req.body)}`);
  try {
    if (command.includes('/sms')) {
      if (text.substring(phoneFormatE164)) {
        const responseNumber = text.substring(0, 12);
        const responseMessage = text.substring(text.indexOf(' ') + 1);
        functions.logger.info(`${command} ${responseNumber} ${responseMessage}`);
        const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        await client.messages.create({
          body: responseMessage,
          from: TWILIO_NUMBER_ONE,
          to: responseNumber,
        });
        /*
        await SendSlackMessage(
          SLACK_CHANNEL.DEBUG,
          `command:${command}, ` +
          `responseNumber:${responseNumber}, ` +
          `responseMessage:${responseMessage}`,
        );
      } else {
        await SendSlackMessage(
          SLACK_CHANNEL.SMS_MMS,
          `After the command, provide the number with no spaces, ` +
          `and after the number provide a single space and the message. ` +
          `Ex.\sms +120623456789 Message to be sent`,
        );
      */
      }
    }
    res.status(200).send({ command: `${command}`, text: `${text}`, sent: 'OK' });
  } catch (e) {
    functions.logger.error(e)
    res.status(400).send(e);
  }
});
