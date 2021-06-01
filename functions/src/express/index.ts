import * as functions from 'firebase-functions';
import * as express from 'express';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import { notFound, errorHandler } from './middlewares/errorHandlers';
import {
  rootRouter,
  pingRouter,
  slackRouter,
  sendgridRouter,
  ivrRouter,
  voiceRouter,
  autoDialerRouter,
  smsRouter,
  twilioRouter,
  questionnaireRouter,
  voicemailRouter,
} from './routers';

export const main = express();

main.use(morgan('combined'));
main.use(helmet());
main.use(cors({ origin: true }));
main.use(express.json({ limit: '1mb' }));
main.use(express.urlencoded({ extended: false }));
main.use(bodyParser.urlencoded({ extended: false }))
main.use(rootRouter);
main.use(pingRouter);
main.use(smsRouter);
main.use(slackRouter);
main.use(ivrRouter);
main.use(voiceRouter);
main.use(voicemailRouter);
main.use(sendgridRouter);
main.use(twilioRouter);
main.use(autoDialerRouter);
main.use(questionnaireRouter);
main.use(notFound);
main.use(errorHandler);

export const twilio = functions.https.onRequest(main);
