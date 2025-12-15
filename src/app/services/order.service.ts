import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, CustomerInfo, OrderStatus } from '../models/order.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly STORAGE_KEY = 'mens_grooming_orders';
  private ordersSubject = new BehaviorSubject<Order[]>(this.loadOrdersFromStorage());
  public orders$ = this.ordersSubject.asObservable();

  constructor() { }

  createOrder(customerInfo: CustomerInfo, items: CartItem[], subtotal: number, tax: number, total: number): Observable<Order> {
    const order: Order = {
      id: this.generateOrderId(),
      customerInfo,
      items,
      subtotal,
      tax,
      total,
      orderDate: new Date(),
      status: OrderStatus.PENDING
    };

    const currentOrders = this.ordersSubject.value;
    currentOrders.unshift(order); // Add to beginning of array
    this.updateOrders(currentOrders);

    return new BehaviorSubject(order).asObservable();
  }

  getOrderById(orderId: string): Observable<Order | undefined> {
    const order = this.ordersSubject.value.find(o => o.id === orderId);
    return new BehaviorSubject(order).asObservable();
  }

  getOrderHistory(): Observable<Order[]> {
    return this.orders$;
  }

  private generateOrderId(): string {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  private updateOrders(orders: Order[]): void {
    this.ordersSubject.next(orders);
    this.saveOrdersToStorage(orders);
  }

  private saveOrdersToStorage(orders: Order[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders to storage:', error);
    }
  }

  private loadOrdersFromStorage(): Order[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading orders from storage:', error);
      return [];
    }
  }
}
