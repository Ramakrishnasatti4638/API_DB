import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server.js';
import { orders } from '../src/data.js';

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

  it('respects the limit query parameter', async () => {
    const app = createApp();
    const res = await request(app).get('/orders?limit=2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(orders.slice(0, 2));
  });

  it('respects the offset query parameter', async () => {
    const app = createApp();
    const res = await request(app).get('/orders?offset=2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(orders.slice(2, 52));
  });

  it('respects both limit and offset query parameters together', async () => {
    const app = createApp();
    const res = await request(app).get('/orders?offset=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(orders.slice(1, 3));
  });

  it('returns an empty array when offset exceeds total orders', async () => {
    const app = createApp();
    const res = await request(app).get('/orders?offset=1000');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('allows maximum limit of 200', async () => {
    const app = createApp();
    const res = await request(app).get('/orders?limit=200');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(orders.slice(0, 200));
  });

  it('returns 400 when limit is less than 1', async () => {
    const app = createApp();
    const res = await request(app).get('/orders?limit=0');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(typeof res.body.error).toBe('string');
  });

  it('returns 400 when limit exceeds 200', async () => {
    const app = createApp();
    const res = await request(app).get('/orders?limit=201');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(typeof res.body.error).toBe('string');
  });

  it('returns 400 when limit is not a whole number', async () => {
    const app = createApp();
    const res = await request(app).get('/orders?limit=abc');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');

    const floatRes = await request(app).get('/orders?limit=2.5');
    expect(floatRes.status).toBe(400);
    expect(floatRes.body).toHaveProperty('error');
  });

  it('returns 400 when offset is negative', async () => {
    const app = createApp();
    const res = await request(app).get('/orders?offset=-1');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(typeof res.body.error).toBe('string');
  });

  it('returns 400 when offset is not a whole number', async () => {
    const app = createApp();
    const res = await request(app).get('/orders?offset=invalid');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');

    const floatRes = await request(app).get('/orders?offset=3.14');
    expect(floatRes.status).toBe(400);
    expect(floatRes.body).toHaveProperty('error');
  });
});
