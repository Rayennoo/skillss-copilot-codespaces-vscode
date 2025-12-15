import { CartItem } from './cart-item.model';

export interface Order {
  id: number;
  items: CartItem[];
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  orderDate: Date;
  status: string;
}
