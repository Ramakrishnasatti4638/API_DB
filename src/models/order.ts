export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface CreateOrderItemDTO {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderDTO {
  customerId: string;
  items: CreateOrderItemDTO[];
  totalAmount: number;
}

export interface OrderQuery {
  page: number;
  pageSize: number;
  status?: string;
}

export interface OrderPage {
  result: Order[];
  total: number;
}
