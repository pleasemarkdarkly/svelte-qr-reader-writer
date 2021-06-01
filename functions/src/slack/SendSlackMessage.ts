import * as functions from 'firebase-functions';
import * as slack from 'slack';
import { errorFn } from '../utils'
import { SLACK_CHANNEL } from './SlackChannel';
import { SLACK_OAUTH_TOKEN } from '../firebase/config';

export const SendSlackMessage = async (channel: SLACK_CHANNEL, message: string) => {
  if (SLACK_OAUTH_TOKEN !== null) {
    try {
      return await slack.chat.postMessage({
        token: SLACK_OAUTH_TOKEN,
        channel: channel,
        text: message,
      });
    } catch (e) {
      errorFn(e);
      functions.logger.error(e);
    }
  } else functions.logger.error(`Slack OAUTH Token is unset. ${SLACK_OAUTH_TOKEN}`);
  return;
};

(async () => {

  functions.logger.info(`Sending message...`);
  await SendSlackMessage(SLACK_CHANNEL.DEBUG, 'party');
  functions.logger.info(`Apparently message sent...`);

});
