import { randomUUID } from 'node:crypto';
import type { Db } from '../db/connection.js';
import type { CreateOrderDTO, Order, OrderItem, OrderQuery, UpdateOrderDTO } from '../models/order.js';

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
        : this.db.prepare('SELECT COUNT(*) AS c FROM orders WHERE status = ?').get(status)
    ) as { c: number };
    return row.c;
  }

  getOrders({ page, pageSize, status }: OrderQuery): Order[] {
    const where = status === undefined ? '' : 'WHERE status = ?';
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

  getOrderById(id: string): Order | undefined {
    const row = this.db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as OrderRow | undefined;
    if (!row) return undefined;
    const itemRows = this.db
      .prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY rowid')
      .all(id) as ItemRow[];
    return {
      id: row.id,
      customerId: row.customer_id,
      totalAmount: row.total_amount,
      status: row.status,
      createdAt: row.created_at,
      items: itemRows.map(toItem),
    };
  }

  updateOrder(id: string, dto: UpdateOrderDTO): Order {
    const existing = this.getOrderById(id);
    if (!existing) {
      throw new Error(`Order with id ${id} not found`);
    }

    const updatedStatus = dto.status !== undefined ? dto.status : existing.status;
    const updatedOrder: Order = {
      id,
      customerId: dto.customerId,
      totalAmount: dto.totalAmount,
      status: updatedStatus,
      createdAt: existing.createdAt,
      items: dto.items.map((i) => ({
        id: this.newId(),
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    };

    const updateOrderStmt = this.db.prepare(
      'UPDATE orders SET customer_id = ?, total_amount = ?, status = ? WHERE id = ?',
    );
    const deleteItemsStmt = this.db.prepare('DELETE FROM order_items WHERE order_id = ?');
    const insertItemStmt = this.db.prepare(
      'INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)',
    );

    this.db.transaction(() => {
      updateOrderStmt.run(updatedOrder.customerId, updatedOrder.totalAmount, updatedOrder.status, id);
      deleteItemsStmt.run(id);
      for (const i of updatedOrder.items) {
        insertItemStmt.run(i.id, id, i.productId, i.quantity, i.unitPrice);
      }
    })();

    return updatedOrder;
  }
}
