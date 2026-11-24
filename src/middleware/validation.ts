import type { Request, Response, NextFunction } from 'express';
import type { CreateOrderDTO, CreateOrderItemDTO, UpdateOrderDTO } from '../models/order.js';

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const isNonNegativeNumber = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0;

export interface ValidatedOrderPayload {
  customerId: string;
  items: CreateOrderItemDTO[];
  totalAmount: number;
  status?: string;
}

export function validateOrderBody(body: unknown, allowStatus = false): { dto?: ValidatedOrderPayload; errors: string[] } {
  const errors: string[] = [];
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { errors: ['Request body must be a JSON object'] };
  }

  const b = body as Record<string, unknown>;

  // Accept customer_id or customerId
  const rawCustomerId = b.customer_id !== undefined ? b.customer_id : b.customerId;
  if (!isNonEmptyString(rawCustomerId)) {
    errors.push('customer_id is required and must be a non-empty string');
  }

  // Accept total_amount or totalAmount
  const rawTotalAmount = b.total_amount !== undefined ? b.total_amount : b.totalAmount;
  if (!isNonNegativeNumber(rawTotalAmount)) {
    errors.push('totalAmount is required and must be a number >= 0');
  }

  if (!Array.isArray(b.items)) {
    errors.push('items is required and must be an array');
  } else if (b.items.length === 0) {
    errors.push('Order must contain at least one item.');
  } else {
    const quantityErrors = new Set<string>();
    b.items.forEach((item: unknown, idx: number) => {
      const it = (typeof item === 'object' && item !== null ? item : {}) as Record<string, unknown>;
      const rawProductId = it.product_id !== undefined ? it.product_id : it.productId;
      if (!isNonEmptyString(rawProductId)) {
        errors.push(`items[${idx}].productId is required and must be a non-empty string`);
      }
      const q = it.quantity;
      if (typeof q !== 'number' || !Number.isFinite(q) || q < 1) {
        quantityErrors.add('Item quantity must be at least 1.');
      } else if (!Number.isInteger(q)) {
        quantityErrors.add('Item quantity must be a whole number.');
      }
      const rawUnitPrice = it.unit_price !== undefined ? it.unit_price : it.unitPrice;
      if (!isNonNegativeNumber(rawUnitPrice)) {
        errors.push(`items[${idx}].unitPrice is required and must be a number >= 0`);
      }
    });
    errors.push(...quantityErrors);
  }

  let status: string | undefined;
  if (allowStatus && b.status !== undefined) {
    if (!isNonEmptyString(b.status)) {
      errors.push('status must be a non-empty string');
    } else {
      status = b.status;
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  const items: CreateOrderItemDTO[] = (b.items as Record<string, unknown>[]).map((it) => ({
    productId: String(it.product_id !== undefined ? it.product_id : it.productId),
    quantity: Number(it.quantity),
    unitPrice: Number(it.unit_price !== undefined ? it.unit_price : it.unitPrice),
  }));

  const dto: ValidatedOrderPayload = {
    customerId: String(rawCustomerId).trim(),
    items,
    totalAmount: Number(rawTotalAmount),
    ...(status !== undefined ? { status } : {}),
  };

  return { dto, errors };
}

export function validateCreateOrderMiddleware(req: Request, res: Response, next: NextFunction): void {
  const { dto, errors } = validateOrderBody(req.body, false);
  if (!dto) {
    res.status(400).json({ error: errors.join('; '), errors });
    return;
  }
  (req as Request & { validatedOrder: CreateOrderDTO }).validatedOrder = dto;
  next();
}

export function validateUpdateOrderMiddleware(req: Request, res: Response, next: NextFunction): void {
  const { dto, errors } = validateOrderBody(req.body, true);
  if (!dto) {
    res.status(400).json({ error: errors.join('; '), errors });
    return;
  }
  (req as Request & { validatedOrder: UpdateOrderDTO }).validatedOrder = dto;
  next();
}
