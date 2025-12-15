import { Injectable, signal, computed } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private readonly STORAGE_KEY = 'hairstyle-shop-cart';

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem(this.STORAGE_KEY);
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        this.cartItemsSubject.next(items);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItemsSubject.value));
  }

  addToCart(product: Product): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
      this.cartItemsSubject.next([...currentItems]);
    } else {
      const newItem: CartItem = { product, quantity: 1 };
      this.cartItemsSubject.next([...currentItems, newItem]);
    }

    this.saveCartToStorage();
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const filteredItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItemsSubject.next(filteredItems);
    this.saveCartToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.product.id === productId);

    if (item) {
      item.quantity = quantity;
      this.cartItemsSubject.next([...currentItems]);
      this.saveCartToStorage();
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  getCartTotal(): Observable<number> {
    return new Observable(observer => {
      this.cartItemsSubject.subscribe(items => {
        const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        observer.next(total);
      });
    });
  }

  getCartItemCount(): Observable<number> {
    return new Observable(observer => {
      this.cartItemsSubject.subscribe(items => {
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        observer.next(count);
      });
    });
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCartToStorage();
  }
}
