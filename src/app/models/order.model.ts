import { CartItem } from './cart-item.model';

export interface Order {
  id: string;
  customerInfo: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  orderDate: Date;
  status: OrderStatus;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}
