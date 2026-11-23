import express from 'express';
import { orders, type Order } from './data.js';

const ALLOWED_STATUSES: readonly Order['status'][] = ['pending', 'paid', 'shipped', 'cancelled'];
const UPDATABLE_FIELDS = ['userId', 'total', 'status'] as const;
type UpdatableField = (typeof UPDATABLE_FIELDS)[number];

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

  app.patch('/orders/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'id must be a positive integer' });
      return;
    }
    const order = orders.find((o) => o.id === id);
    if (!order) {
      res.status(404).json({ error: `order ${id} not found` });
      return;
    }
    const body = req.body;
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'request body must be a JSON object' });
      return;
    }
    const updates: Partial<Record<UpdatableField, unknown>> = {};
    for (const field of UPDATABLE_FIELDS) {
      if (field in body) {
        updates[field] = body[field];
      }
    }
    if ('id' in body || 'createdAt' in body) {
      res.status(400).json({ error: 'id and createdAt cannot be updated' });
      return;
    }
    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: `at least one of ${UPDATABLE_FIELDS.join(', ')} is required` });
      return;
    }
    if ('userId' in updates) {
      if (!Number.isInteger(updates.userId) || (updates.userId as number) <= 0) {
        res.status(400).json({ error: 'userId must be a positive integer' });
        return;
      }
      order.userId = updates.userId as number;
    }
    if ('total' in updates) {
      const total = updates.total;
      if (typeof total !== 'number' || !Number.isFinite(total) || total < 0) {
        res.status(400).json({ error: 'total must be a non-negative finite number' });
        return;
      }
      order.total = total;
    }
    if ('status' in updates) {
      if (typeof updates.status !== 'string' || !ALLOWED_STATUSES.includes(updates.status as Order['status'])) {
        res.status(400).json({ error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}` });
        return;
      }
      order.status = updates.status as Order['status'];
    }
    res.status(200).json(order);
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
