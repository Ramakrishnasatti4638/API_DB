export interface Order {
  id: number;
  userId: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  createdAt: string;
}

export const orders: Order[] = [
  { id: 1, userId: 1, total: 19.99, status: 'paid', createdAt: '2024-01-01T10:00:00Z' },
  { id: 2, userId: 2, total: 29.5, status: 'shipped', createdAt: '2024-01-02T11:30:00Z' },
  { id: 3, userId: 1, total: 5.0, status: 'pending', createdAt: '2024-01-03T09:15:00Z' },
  { id: 4, userId: 3, total: 120.0, status: 'paid', createdAt: '2024-01-04T14:45:00Z' },
  { id: 5, userId: 2, total: 42.25, status: 'cancelled', createdAt: '2024-01-05T08:00:00Z' },
];
