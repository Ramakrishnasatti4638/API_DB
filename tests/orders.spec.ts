import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server.js';

describe('GET /orders', () => {
  it('returns a 200 response', async () => {
    const app = createApp();
    const res = await request(app).get('/orders');
    expect(res.status).toBe(200);
  });

  it('returns an array of orders by default', async () => {
    const app = createApp();
    const res = await request(app).get('/orders');
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('each order has the expected shape', async () => {
    const app = createApp();
    const res = await request(app).get('/orders');
    for (const order of res.body) {
      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('userId');
      expect(order).toHaveProperty('total');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('createdAt');
    }
  });
});

describe('DELETE /orders/:id', () => {
  it('returns 204 when deleting an existing order', async () => {
    const app = createApp();
    const res = await request(app).delete('/orders/1');
    expect(res.status).toBe(204);
  });

  it('returns 404 when the order does not exist', async () => {
    const app = createApp();
    const res = await request(app).delete('/orders/9999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when the id is not a positive integer', async () => {
    const app = createApp();
    const res = await request(app).delete('/orders/abc');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when the id is zero', async () => {
    const app = createApp();
    const res = await request(app).delete('/orders/0');
    expect(res.status).toBe(400);
  });

  it('returns 400 when the id is negative', async () => {
    const app = createApp();
    const res = await request(app).delete('/orders/-1');
    expect(res.status).toBe(400);
  });
});

describe('PATCH /orders/:id', () => {
  it('returns 200 and the updated order when patching status', async () => {
    const app = createApp();
    const res = await request(app)
      .patch('/orders/4')
      .send({ status: 'shipped' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 4, status: 'shipped' });
  });

  it('returns 200 and the updated order when patching multiple fields', async () => {
    const app = createApp();
    const res = await request(app)
      .patch('/orders/2')
      .send({ total: 99.5, status: 'paid' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 2, total: 99.5, status: 'paid' });
  });

  it('persists the update in subsequent GET /orders responses', async () => {
    const app = createApp();
    await request(app).patch('/orders/3').send({ status: 'cancelled' });
    const list = await request(app).get('/orders');
    const updated = list.body.find((o: { id: number }) => o.id === 3);
    expect(updated).toMatchObject({ id: 3, status: 'cancelled' });
  });

  it('returns 404 when the order does not exist', async () => {
    const app = createApp();
    const res = await request(app)
      .patch('/orders/9999')
      .send({ status: 'paid' });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when the id is not a positive integer', async () => {
    const app = createApp();
    const res = await request(app)
      .patch('/orders/abc')
      .send({ status: 'paid' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when the body is empty', async () => {
    const app = createApp();
    const res = await request(app).patch('/orders/4').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when the body contains only immutable fields', async () => {
    const app = createApp();
    const res = await request(app)
      .patch('/orders/4')
      .send({ id: 999, createdAt: '2025-01-01T00:00:00Z' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when status is not one of the allowed values', async () => {
    const app = createApp();
    const res = await request(app)
      .patch('/orders/4')
      .send({ status: 'unknown' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when total is negative', async () => {
    const app = createApp();
    const res = await request(app)
      .patch('/orders/4')
      .send({ total: -1 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when userId is not a positive integer', async () => {
    const app = createApp();
    const res = await request(app)
      .patch('/orders/4')
      .send({ userId: 0 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
