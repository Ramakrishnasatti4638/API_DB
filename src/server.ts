import express from 'express';
import { orders } from './data.js';

export function createApp(): express.Express {
  const app = express();
  app.use(express.json());

  app.get('/orders', (req, res) => {
    let limit = 50;
    let offset = 0;

    if (req.query.limit !== undefined) {
      const limitRaw = String(req.query.limit).trim();
      if (!/^\d+$/.test(limitRaw)) {
        res.status(400).json({ error: 'limit must be a whole number between 1 and 200' });
        return;
      }
      const parsedLimit = Number(limitRaw);
      if (parsedLimit < 1 || parsedLimit > 200) {
        res.status(400).json({ error: 'limit must be a whole number between 1 and 200' });
        return;
      }
      limit = parsedLimit;
    }

    if (req.query.offset !== undefined) {
      const offsetRaw = String(req.query.offset).trim();
      if (!/^\d+$/.test(offsetRaw)) {
        res.status(400).json({ error: 'offset must be a whole number greater than or equal to 0' });
        return;
      }
      offset = Number(offsetRaw);
    }

    const paginatedOrders = orders.slice(offset, offset + limit);
    res.status(200).json(paginatedOrders);
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
