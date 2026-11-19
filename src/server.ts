import express from 'express';
import { orders } from './data.js';

export function createApp(): express.Express {
  const app = express();
  app.use(express.json());

  app.get('/orders', (_req, res) => {
    res.status(200).json(orders);
  });

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  return app;
}

const app = createApp();
const PORT = Number(process.env.PORT) || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Orders API listening on port ${PORT}`);
  });
}
