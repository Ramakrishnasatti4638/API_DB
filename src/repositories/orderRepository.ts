import { randomUUID } from 'node:crypto';
import type { Db } from '../db/connection.js';
import type { CreateOrderDTO, Order, OrderItem, OrderQuery } from '../models/order.js';

interface OrderRow {
  id: string;
  customer_id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface ItemRow {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

const toItem = (r: ItemRow): OrderItem => ({
  id: r.id,
  productId: r.product_id,
  quantity: r.quantity,
  unitPrice: r.unit_price,
});

export class OrderRepository {
  constructor(
    private readonly db: Db,
    private readonly newId: () => string = randomUUID,
  ) {}

  createOrder(dto: CreateOrderDTO): Order {
    const order: Order = {
      id: this.newId(),
      customerId: dto.customerId,
      totalAmount: dto.totalAmount,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      items: dto.items.map((i) => ({
        id: this.newId(),
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    };
    const insertOrder = this.db.prepare(
      'INSERT INTO orders (id, customer_id, total_amount, status, created_at) VALUES (?, ?, ?, ?, ?)',
    );
    const insertItem = this.db.prepare(
      'INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)',
    );
    this.db.transaction(() => {
      insertOrder.run(order.id, order.customerId, order.totalAmount, order.status, order.createdAt);
      for (const i of order.items) insertItem.run(i.id, order.id, i.productId, i.quantity, i.unitPrice);
    })();
    return order;
  }

  countOrders(status?: string): number {
    const row = (
      status === undefined
        ? this.db.prepare('SELECT COUNT(*) AS c FROM orders').get()
        : this.db.prepare('SELECT COUNT(*) AS c FROM orders WHERE LOWER(status) = LOWER(?)').get(status)
    ) as { c: number };
    return row.c;
  }

  getOrders({ page, pageSize, status }: OrderQuery): Order[] {
    const where = status === undefined ? '' : 'WHERE LOWER(status) = LOWER(?)';
    const params: unknown[] = status === undefined ? [] : [status];
    const rows = this.db
      .prepare(`SELECT * FROM orders ${where} ORDER BY created_at DESC, id LIMIT ? OFFSET ?`)
      .all(...params, pageSize, (page - 1) * pageSize) as OrderRow[];
    if (rows.length === 0) return [];
    const placeholders = rows.map(() => '?').join(',');
    const items = this.db
      .prepare(`SELECT * FROM order_items WHERE order_id IN (${placeholders}) ORDER BY rowid`)
      .all(...rows.map((r) => r.id)) as ItemRow[];
    return rows.map((r) => ({
      id: r.id,
      customerId: r.customer_id,
      totalAmount: r.total_amount,
      status: r.status,
      createdAt: r.created_at,
      items: items.filter((i) => i.order_id === r.id).map(toItem),
    }));
  }
}
