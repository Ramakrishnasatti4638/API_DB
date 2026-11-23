import express from 'express';
import { orders } from './data.js';

export function createApp(): express.Express {
  const app = express();
  app.use(express.json());

  app.get('/orders', (_req, res) => {
    res.status(200).json(orders);
  });

  app.delete('/orders/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'id must be a positive integer' });
      return;
    }
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) {
      res.status(404).json({ error: `order ${id} not found` });
      return;
    }
    orders.splice(index, 1);
    res.status(204).send();
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
