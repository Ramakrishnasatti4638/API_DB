import express from 'express';
import { createConnection, type Db } from './db/connection.js';
import { migrate } from './db/migrate.js';
import type { CreateOrderDTO, UpdateOrderDTO } from './models/order.js';
import { OrderRepository } from './repositories/orderRepository.js';
import {
  validateCreateOrderMiddleware,
  validateUpdateOrderMiddleware,
} from './middleware/validation.js';

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 10;

function parsePositiveInt(raw: unknown, name: string, errors: string[], fallback: number, max?: number): number {
  if (raw === undefined) return fallback;
  if (typeof raw !== 'string' || !/^\d+$/.test(raw) || Number(raw) < 1) {
    errors.push(`${name} must be an integer >= 1`);
    return fallback;
  }
  const n = Number(raw);
  if (max !== undefined && n > max) {
    errors.push(`${name} must be <= ${max}`);
    return fallback;
  }
  return n;
}

export function createApp(db: Db = createConnection(), repo?: OrderRepository): express.Express {
  migrate(db);
  const orders = repo ?? new OrderRepository(db);
  const app = express();
  app.use(express.json());

  app.post('/orders', validateCreateOrderMiddleware, (req, res, next) => {
    const dto = (req as express.Request & { validatedOrder: CreateOrderDTO }).validatedOrder;
    try {
      res.status(201).json(orders.createOrder(dto));
    } catch (err) {
      next(err);
    }
  });

  app.put('/orders/:id', validateUpdateOrderMiddleware, (req, res, next) => {
    const { id } = req.params;
    const dto = (req as express.Request & { validatedOrder: UpdateOrderDTO }).validatedOrder;
    try {
      const existing = orders.getOrderById(id);
      if (!existing) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      if (existing.status.trim().toLowerCase() === 'delivered') {
        const errorMsg = 'Cannot update an order that has already been delivered';
        res.status(400).json({ error: errorMsg, errors: [errorMsg] });
        return;
      }
      const updated = orders.updateOrder(id, dto);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

  app.get('/orders', (req, res, next) => {
    const errors: string[] = [];
    const page = parsePositiveInt(req.query.page, 'page', errors, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 'pageSize', errors, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    let status: string | undefined;
    if (req.query.status !== undefined) {
      if (typeof req.query.status !== 'string' || req.query.status.length === 0) {
        errors.push('status must be a non-empty string');
      } else {
        status = req.query.status;
      }
    }
    if (errors.length > 0) {
      res.status(400).json({ error: errors.join('; '), errors });
      return;
    }
    try {
      res.status(200).json({ result: orders.getOrders({ page, pageSize, status }), total: orders.countOrders(status) });
    } catch (err) {
      next(err);
    }
  });

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = (err as { status?: number }).status;
    if (status === 400) {
      res.status(400).json({ error: 'Malformed JSON body' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const app = createApp();
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Orders API listening on port ${PORT}`);
  });
}
