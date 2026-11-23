import express from 'express';
import { createConnection, type Db } from './db/connection.js';
import { migrate } from './db/migrate.js';
import type { CreateOrderDTO } from './models/order.js';
import { OrderRepository } from './repositories/orderRepository.js';

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 10;

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const isNonNegativeNumber = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0;

function validateCreateOrder(body: unknown): { dto?: CreateOrderDTO; errors: string[] } {
  const errors: string[] = [];
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { errors: ['Request body must be a JSON object'] };
  }
  const b = body as Record<string, unknown>;
  if (!isNonEmptyString(b.customerId)) errors.push('customerId is required and must be a non-empty string');
  if (!isNonNegativeNumber(b.totalAmount)) errors.push('totalAmount is required and must be a number >= 0');
  if (!Array.isArray(b.items)) {
    errors.push('items is required and must be an array');
  } else if (b.items.length === 0) {
    errors.push('Order must contain at least one item.');
  } else {
    const quantityErrors = new Set<string>();
    b.items.forEach((item: unknown, idx: number) => {
      const it = (typeof item === 'object' && item !== null ? item : {}) as Record<string, unknown>;
      if (!isNonEmptyString(it.productId)) errors.push(`items[${idx}].productId is required and must be a non-empty string`);
      const q = it.quantity;
      if (typeof q !== 'number' || !Number.isFinite(q) || q < 1) {
        quantityErrors.add('Item quantity must be at least 1.');
      } else if (!Number.isInteger(q)) {
        quantityErrors.add('Item quantity must be a whole number.');
      }
      if (!isNonNegativeNumber(it.unitPrice)) errors.push(`items[${idx}].unitPrice is required and must be a number >= 0`);
    });
    errors.push(...quantityErrors);
  }
  return errors.length > 0 ? { errors } : { dto: b as unknown as CreateOrderDTO, errors };
}

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

  app.post('/orders', (req, res, next) => {
    const { dto, errors } = validateCreateOrder(req.body);
    if (!dto) {
      res.status(400).json({ error: errors.join('; '), errors });
      return;
    }
    try {
      res.status(201).json(orders.createOrder(dto));
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
