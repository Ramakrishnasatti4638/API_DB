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
