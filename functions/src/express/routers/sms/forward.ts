import * as functions from 'firebase-functions';
import * as SendGrid from '@sendgrid/mail';
import * as fetch from 'node-fetch';
import * as escape from 'html-escape';
import {
  SENDGRID_API_KEY,
  SENDGRID_TEMPLATE_ID_EX_MMS
} from '../../../firebase/config';
import { SLACK_CHANNEL, SlackInstrument } from '../../../slack';

export const forwardSMSToEmail = async (req: any) => {
  try {
    SendGrid.setApiKey(SENDGRID_API_KEY);
    const { body } = req;
    const NumMedia = req.body?.NumMedia;
    const { From: SenderNumber } = body;
    const mediaItems = [] as any;
    if (NumMedia !== undefined) {
      functions.logger.info(`MMS with ${parseInt(NumMedia)} attachments received from ` +
        `${SenderNumber}, forwarding to help@example.com.`);
      for (let i = 0; i < req.body?.NumMedia; i++) {
        // eslint-disable-line
        const mediaUrl = body[`MediaUrl${i}`];
        const contentType = body[`MediaContentType${i}`];
        const extension = contentType.split('/')[1];
        const attachment_name = 'attachment-' + i;
        const response = await fetch('https://api.twilio.com/' + mediaUrl);
        const fileBuffer = await response.buffer();
        const attachment = (fileBuffer as Buffer).toString('base64');
        const filename = attachment_name + '.' + extension;
        functions.logger.info(`MMS available from Twilio: mediaUrl:${mediaUrl}, ` +
          `filename:${filename}, contentType:${contentType}, bufferSize:${fileBuffer.length},` +
          ` base64:${attachment.length}`);
        mediaItems.push({
          filename: filename,
          type: contentType,
          content: attachment,
        });
      }
    }

    const message = {
      to: 'sales@ex.com',
      from: 'sales@ex.com',
      templateId: SENDGRID_TEMPLATE_ID_EX_MMS,
      dynamic_template_data: {
        caller: SenderNumber,
        subject: `${SenderNumber as string} sent a MMS containing ${parseInt(NumMedia)} attachment(s).`,
        message: `Twilio SMS/MMS metadata:${escape(JSON.stringify(body))}`,
        mediaCount: `${parseInt(NumMedia)}`,
      },
      attachments: mediaItems,
    };

    const { Body, To, From } = req?.body;
    const notify = new SlackInstrument(`${From} sent ${NumMedia} MMS attachment(s) to ${To}.  ` +
      `Forwarding to help@example.com and Slack Channel.`);
    (Body.length > 0)
      ? await notify.add(`SMS message:${Body}`)
      : await notify.add(`No SMS message was attached`);
    for (let j = 0; j < NumMedia; j++) {
      const mediaUrl = body[`MediaUrl${j}`];
      const contentType = body[`MediaContentType${j}`];
      await notify.add(`(${j + 1}/${NumMedia}) ${mediaUrl} (${contentType})`);
    }
    await notify.send(SLACK_CHANNEL.SMS_MMS);
    return await SendGrid.send(message);
  } catch (e) {
    functions.logger.error(`/mms forwarding ERROR`, e);
    functions.logger.error(`req.body:${JSON.stringify(req.body)}`);
    const notify = new SlackInstrument(`MMS forwarding encountered an ERROR.`);
    await notify.add(`Error:${JSON.stringify(e)}, Request.Body:${JSON.stringify(req.body)}`);
    await notify.send(SLACK_CHANNEL.DEBUG);
    return e;
  }
};
