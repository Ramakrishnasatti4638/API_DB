import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import {
  validateOrderBody,
  validateCreateOrderMiddleware,
  validateUpdateOrderMiddleware,
} from '../src/middleware/validation.js';

describe('validateOrderBody unit tests', () => {
  it('returns error when body is not an object', () => {
    expect(validateOrderBody('bad string')).toEqual({
      errors: ['Request body must be a JSON object'],
    });
    expect(validateOrderBody(null)).toEqual({
      errors: ['Request body must be a JSON object'],
    });
    expect(validateOrderBody([])).toEqual({
      errors: ['Request body must be a JSON object'],
    });
  });

  it('normalizes customer_id and customerId', () => {
    const resSnake = validateOrderBody({
      customer_id: 'cust-1',
      items: [{ productId: 'p1', quantity: 1, unitPrice: 10 }],
      totalAmount: 10,
    });
    expect(resSnake.errors).toEqual([]);
    expect(resSnake.dto?.customerId).toBe('cust-1');

    const resCamel = validateOrderBody({
      customerId: 'cust-2',
      items: [{ product_id: 'p1', quantity: 1, unit_price: 10 }],
      total_amount: 10,
    });
    expect(resCamel.errors).toEqual([]);
    expect(resCamel.dto?.customerId).toBe('cust-2');
    expect(resCamel.dto?.totalAmount).toBe(10);
    expect(resCamel.dto?.items[0]).toEqual({
      productId: 'p1',
      quantity: 1,
      unitPrice: 10,
    });
  });

  it('collects multiple validation errors', () => {
    const res = validateOrderBody({
      customer_id: '',
      items: 'not-array',
      total_amount: -5,
    });
    expect(res.errors).toContain('customer_id is required and must be a non-empty string');
    expect(res.errors).toContain('items is required and must be an array');
    expect(res.errors).toContain('totalAmount is required and must be a number >= 0');
  });

  it('validates status only when allowStatus is true', () => {
    const withoutStatusFlag = validateOrderBody(
      {
        customer_id: 'c1',
        items: [{ productId: 'p1', quantity: 1, unitPrice: 5 }],
        totalAmount: 5,
        status: 'Delivered',
      },
      false,
    );
    expect(withoutStatusFlag.dto?.status).toBeUndefined();

    const withStatusFlag = validateOrderBody(
      {
        customer_id: 'c1',
        items: [{ productId: 'p1', quantity: 1, unitPrice: 5 }],
        totalAmount: 5,
        status: 'Delivered',
      },
      true,
    );
    expect(withStatusFlag.dto?.status).toBe('Delivered');

    const invalidStatus = validateOrderBody(
      {
        customer_id: 'c1',
        items: [{ productId: 'p1', quantity: 1, unitPrice: 5 }],
        totalAmount: 5,
        status: '',
      },
      true,
    );
    expect(invalidStatus.errors).toContain('status must be a non-empty string');
  });
});

describe('validation middleware express integration', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/test-create', validateCreateOrderMiddleware, (req, res) => {
      res.status(200).json((req as unknown as { validatedOrder: unknown }).validatedOrder);
    });
    app.put('/test-update', validateUpdateOrderMiddleware, (req, res) => {
      res.status(200).json((req as unknown as { validatedOrder: unknown }).validatedOrder);
    });
  });

  it('validateCreateOrderMiddleware returns 400 with errors array on invalid body', async () => {
    const res = await request(app).post('/test-create').send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(typeof res.body.error).toBe('string');
  });

  it('validateCreateOrderMiddleware forwards validated dto to next handler', async () => {
    const res = await request(app).post('/test-create').send({
      customer_id: 'c123',
      items: [{ product_id: 'prod-1', quantity: 2, unit_price: 15 }],
      total_amount: 30,
    });
    expect(res.status).toBe(200);
    expect(res.body.customerId).toBe('c123');
    expect(res.body.totalAmount).toBe(30);
  });

  it('validateUpdateOrderMiddleware attaches status when valid', async () => {
    const res = await request(app).put('/test-update').send({
      customer_id: 'c123',
      items: [{ product_id: 'prod-1', quantity: 2, unit_price: 15 }],
      total_amount: 30,
      status: 'Shipped',
    });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Shipped');
  });
});
