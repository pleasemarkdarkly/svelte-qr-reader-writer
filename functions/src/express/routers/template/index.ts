import { Router } from 'express';
import * as functions from 'firebase-functions';

export const router = Router();

router.get('/template', (req, res) => {
  const health_check = {
    uptime: process.uptime(),
    path: '/template',
    message: 'OK',
    timestamp: Date.now(),
  };
  res.send(health_check);
});

router.post('/template', async (req, res) => {
  functions.logger.info(`/template => req.body:` +
    `${JSON.stringify(req.body)}`);
  try {
    res.status(200).send({
      success: true,
      data: `${JSON.stringify(req.body)}`
    });
  } catch (e) {
    functions.logger.error(e);
    res.status(400).send(e);
  }
});
