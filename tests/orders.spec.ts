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
