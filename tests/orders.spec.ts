import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server.js';
import { createConnection, type Db } from '../src/db/connection.js';
import { migrate } from '../src/db/migrate.js';
import { OrderRepository } from '../src/repositories/orderRepository.js';

const validBody = {
  customerId: 'cust-1',
  items: [{ productId: 'p-1', quantity: 2, unitPrice: 9.99 }],
  totalAmount: 19.98,
};

let db: Db;
let app: ReturnType<typeof createApp>;

beforeEach(() => {
  db = createConnection(':memory:');
  app = createApp(db);
});

const counts = () => ({
  orders: (db.prepare('SELECT COUNT(*) c FROM orders').get() as { c: number }).c,
  items: (db.prepare('SELECT COUNT(*) c FROM order_items').get() as { c: number }).c,
});

describe('migrations', () => {
  it('is idempotent and creates tables', () => {
    migrate(db);
    migrate(db);
    expect(db.prepare('SELECT COUNT(*) c FROM schema_migrations').get()).toEqual({ c: 2 });
    expect(counts()).toEqual({ orders: 0, items: 0 });

    const indexes = (
      db.prepare("SELECT name FROM sqlite_master WHERE type = 'index'").all() as { name: string }[]
    ).map((r) => r.name);
    expect(indexes).toContain('idx_orders_customer_id_created_at');
    expect(indexes).toContain('idx_orders_status');
  });
});

describe('POST /orders', () => {
  it('creates an order and persists it', async () => {
    const res = await request(app).post('/orders').send(validBody);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ customerId: 'cust-1', status: 'Pending', totalAmount: 19.98 });
    expect(res.body.id).toBeTruthy();
    expect(new Date(res.body.createdAt).toString()).not.toBe('Invalid Date');
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0]).toMatchObject({ productId: 'p-1', quantity: 2, unitPrice: 9.99 });
    expect(counts()).toEqual({ orders: 1, items: 1 });
  });

  const bad: [string, unknown][] = [
    ['missing customerId', { ...validBody, customerId: undefined }],
    ['empty customerId', { ...validBody, customerId: '  ' }],
    ['missing items', { ...validBody, items: undefined }],
    ['empty items', { ...validBody, items: [] }],
    ['missing productId', { ...validBody, items: [{ quantity: 1, unitPrice: 1 }] }],
    ['zero quantity', { ...validBody, items: [{ productId: 'p', quantity: 0, unitPrice: 1 }] }],
    ['negative quantity', { ...validBody, items: [{ productId: 'p', quantity: -1, unitPrice: 1 }] }],
    ['fractional quantity', { ...validBody, items: [{ productId: 'p', quantity: 1.5, unitPrice: 1 }] }],
    ['negative unitPrice', { ...validBody, items: [{ productId: 'p', quantity: 1, unitPrice: -1 }] }],
    ['missing unitPrice', { ...validBody, items: [{ productId: 'p', quantity: 1 }] }],
    ['invalid totalAmount', { ...validBody, totalAmount: 'abc' }],
    ['negative totalAmount', { ...validBody, totalAmount: -5 }],
  ];
  it.each(bad)('returns 400 for %s', async (_name, body) => {
    const res = await request(app).post('/orders').send(body as object);
    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe('string');
    expect(counts()).toEqual({ orders: 0, items: 0 });
  });

  describe('BUG-0001 regression', () => {
    const EMPTY_MSG = 'Order must contain at least one item.';
    const QTY_MSG = 'Item quantity must be at least 1.';
    const item = (quantity: unknown) => ({ productId: 'p1', quantity, unitPrice: 10 });

    const expectRejected = (res: request.Response, message: string) => {
      expect(res.status).toBe(400);
      expect(res.body.errors).toContain(message);
      expect(res.body.error).toContain(message);
      expect(counts()).toEqual({ orders: 0, items: 0 });
    };

    it('rejects empty items with the required message', async () => {
      const res = await request(app).post('/orders').send({ ...validBody, items: [] });
      expectRejected(res, EMPTY_MSG);
      expect(res.body.errors).toEqual([EMPTY_MSG]);
      expect(res.body.error).toBe(EMPTY_MSG);
    });

    it('rejects a negative quantity with the required message', async () => {
      const res = await request(app).post('/orders').send({ ...validBody, items: [item(-5)] });
      expectRejected(res, QTY_MSG);
      expect(res.body.errors).toEqual([QTY_MSG]);
    });

    it('rejects a zero quantity with the required message', async () => {
      const res = await request(app).post('/orders').send({ ...validBody, items: [item(0)] });
      expectRejected(res, QTY_MSG);
    });

    it('rejects a non-numeric quantity with the required message', async () => {
      const res = await request(app).post('/orders').send({ ...validBody, items: [item('2')] });
      expectRejected(res, QTY_MSG);
    });

    it('saves nothing when only one of several items is invalid', async () => {
      const res = await request(app).post('/orders').send({ ...validBody, items: [item(1), item(-1)] });
      expectRejected(res, QTY_MSG);
    });

    it('reports the quantity message once when several items fail', async () => {
      const res = await request(app).post('/orders').send({ ...validBody, items: [item(-1), item(0)] });
      expectRejected(res, QTY_MSG);
      expect(res.body.errors.filter((e: string) => e === QTY_MSG)).toHaveLength(1);
    });

    it('rejects a fractional quantity with the whole-number message', async () => {
      const res = await request(app).post('/orders').send({ ...validBody, items: [item(1.5)] });
      expectRejected(res, 'Item quantity must be a whole number.');
    });

    it('rejects the empty-items curl body from the report (never 500)', async () => {
      const res = await request(app).post('/orders').send({ customerId: 'c123', items: [] });
      expectRejected(res, EMPTY_MSG);
    });

    it('rejects the negative-quantity curl body from the report (never 201)', async () => {
      const res = await request(app)
        .post('/orders')
        .send({ customerId: 'c123', items: [{ productId: 'p1', quantity: -2, unitPrice: 10 }] });
      expectRejected(res, QTY_MSG);
    });

    it('keeps the "must be an array" message for a non-array items', async () => {
      const res = await request(app).post('/orders').send({ ...validBody, items: 'x' });
      expectRejected(res, 'items is required and must be an array');
    });
  });

  it('returns 400 for a non-object body', async () => {
    const res = await request(app).post('/orders').send([1, 2]);
    expect(res.status).toBe(400);
  });

  it('returns 400 for malformed JSON', async () => {
    const res = await request(app).post('/orders').set('Content-Type', 'application/json').send('{bad');
    expect(res.status).toBe(400);
  });

  it('rolls back and returns 500 when an item insert fails', async () => {
    let n = 0;
    // first id (order) is unique; the second and third (items) collide -> PK violation on 2nd item
    const repo = new OrderRepository(db, () => (n++ === 0 ? 'order-1' : 'dup'));
    const failingApp = createApp(db, repo);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await request(failingApp)
      .post('/orders')
      .send({ ...validBody, items: [validBody.items[0], validBody.items[0]] });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
    expect(counts()).toEqual({ orders: 0, items: 0 });
  });
});

describe('GET /orders', () => {
  it('returns empty result on an empty database', async () => {
    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ items: [], totalCount: 0, page: 1, pageSize: 20 });
  });

  it('returns orders with items and totalCount and default pagination', async () => {
    await request(app).post('/orders').send(validBody);
    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
    expect(res.body.totalCount).toBe(1);
    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(20);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].items).toHaveLength(1);
  });

  it('paginates and preserves metadata', async () => {
    for (let i = 0; i < 5; i++) await request(app).post('/orders').send(validBody);
    const p1 = await request(app).get('/orders?page=1&pageSize=2');
    const p3 = await request(app).get('/orders?page=3&pageSize=2');
    const p4 = await request(app).get('/orders?page=4&pageSize=2');
    expect(p1.body.items).toHaveLength(2);
    expect(p1.body.totalCount).toBe(5);
    expect(p1.body.page).toBe(1);
    expect(p1.body.pageSize).toBe(2);

    expect(p3.body.items).toHaveLength(1);
    expect(p3.body.totalCount).toBe(5);
    expect(p3.body.page).toBe(3);
    expect(p3.body.pageSize).toBe(2);

    expect(p4.body).toEqual({ items: [], totalCount: 5, page: 4, pageSize: 2 });
  });

  it('filters by status', async () => {
    await request(app).post('/orders').send(validBody);
    await request(app).post('/orders').send(validBody);
    db.prepare("UPDATE orders SET status = 'Shipped' WHERE id = (SELECT id FROM orders LIMIT 1)").run();
    const shipped = await request(app).get('/orders?status=Shipped');
    expect(shipped.body.totalCount).toBe(1);
    expect(shipped.body.page).toBe(1);
    expect(shipped.body.pageSize).toBe(20);
    expect(shipped.body.items[0].status).toBe('Shipped');

    const none = await request(app).get('/orders?status=Cancelled');
    expect(none.body).toEqual({ items: [], totalCount: 0, page: 1, pageSize: 20 });
  });

  it('supports pageSize up to 100', async () => {
    const res = await request(app).get('/orders?pageSize=100');
    expect(res.status).toBe(200);
    expect(res.body.pageSize).toBe(100);
  });

  it.each(['page=0', 'page=abc', 'page=1.5', 'pageSize=0', 'pageSize=-1', 'pageSize=x', 'pageSize=101', 'status='])(
    'returns 400 for %s',
    async (qs) => {
      const res = await request(app).get(`/orders?${qs}`);
      expect(res.status).toBe(400);
      expect(res.body.error).toBeTruthy();
    },
  );
});
