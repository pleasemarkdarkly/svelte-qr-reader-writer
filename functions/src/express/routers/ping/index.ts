import { Router } from 'express';

export const router = Router();

router.all('/pong', (req, res) => {
  const health_check = {
    uptime: process.uptime(),
    path: '/pong',
    message: 'OK',
    timestamp: Date.now(),
  };
  res.send(health_check);
  res.end();
});

router.all('/ping', (req, res) => {
  const health_check = {
    uptime: process.uptime(),
    path: '/ping',
    message: 'OK',
    timestamp: Date.now(),
  };
  res.send(health_check);
  res.end();
});
