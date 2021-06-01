import * as functions from 'firebase-functions';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from '../../../firebase/config';

export const sendSMS = async (respondingNumber: number, caller: number, message: string) => {
  const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  try {
    return await client.messages.create({
      body: message,
      from: respondingNumber,
      to: caller,
    });
  } catch (error) {
    if (error.code === 21614) {
      functions.logger.error(`Error, looks like ${caller} can not recieve sms messages`);
    }
  }  
};
