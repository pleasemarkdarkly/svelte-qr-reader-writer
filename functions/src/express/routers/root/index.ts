import { Router } from 'express';
export const router = Router();

router.get('/', (req, res) => {
  const health_check = {
    uptime: process.uptime(),
    path: '/',
    message: 'OK',
    timestamp: Date.now(),
  };
  res.send(health_check);
});

router.post('/', (req, res) => {
  res.send(req.body);
});
