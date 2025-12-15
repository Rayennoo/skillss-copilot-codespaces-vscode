import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private nextOrderId = 1;

  constructor() {
    this.loadOrdersFromStorage();
  }

  private loadOrdersFromStorage(): void {
    const savedOrders = localStorage.getItem('hairstyle-shop-orders');
    if (savedOrders) {
      try {
        this.orders = JSON.parse(savedOrders);
        this.nextOrderId = Math.max(...this.orders.map(o => o.id), 0) + 1;
        this.ordersSubject.next(this.orders);
      } catch (error) {
        console.error('Error loading orders from storage:', error);
      }
    }
  }

  private saveOrdersToStorage(): void {
    localStorage.setItem('hairstyle-shop-orders', JSON.stringify(this.orders));
  }

  createOrder(order: Order): Observable<Order> {
    const newOrder: Order = {
      ...order,
      id: this.nextOrderId++,
      orderDate: new Date(),
      status: 'Pending'
    };
    
    this.orders.push(newOrder);
    this.ordersSubject.next(this.orders);
    this.saveOrdersToStorage();
    
    return of(newOrder);
  }

  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  getOrderById(id: number): Observable<Order> {
    const order = this.orders.find(o => o.id === id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    return of(order);
  }
}
