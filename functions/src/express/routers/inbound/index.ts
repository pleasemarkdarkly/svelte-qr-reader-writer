import * as functions from 'firebase-functions';
import { Router } from 'express';
import { optOut_recording } from '../common';
import {
  welcome,
  redirectWelcome,
  enrollOffers,
  drivingDirections,
} from './handler';

export const router = Router();

router.get('/inbound', (req: any, res: any) => {
  const health_check = {
    uptime: process.uptime(),
    path: '/inbound',
    message: 'OK',
    timestamp: Date.now(),
  };
  res.send(health_check);
});

router.post('/inbound', async (req: any, res: any) => {
  const { From, Digits } = req.body;
  (Digits !== undefined)
    ? functions.logger.info(`IVR:${From} selected digit:${Digits}.`)
    : functions.logger.info(`IVR:${From} started.`);
  if (!Digits) {
    welcome(req, res);
  } else {
    switch (req.body?.Digits) {
      case '1':
        await enrollOffers(req, res);
        break;
      case '2':
        // await transfer(req, res);
        break;
      case '3':
        // await transfer(req, res);
        break;
      case '4':
        await drivingDirections(req, res);
        break;
      case '5':
        break;
      case '6':
        break;
      case '7':
        break;
      case '8':
        break;
      case '9':
        await optOut_recording(req, res);
        break;
      case '0':
        await redirectWelcome(req, res);
        break;
      default:
        redirectWelcome(req, res);
    }
  }
});
