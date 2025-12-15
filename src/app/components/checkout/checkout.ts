import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartItem } from '../../models/cart-item.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  cartTotal = 0;
  orderPlaced = false;
  orderConfirmation: Order | null = null;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      shippingAddress: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      if (items.length === 0 && !this.orderPlaced) {
        this.router.navigate(['/cart']);
      }
    });

    this.cartService.getCartTotal().subscribe(total => {
      this.cartTotal = total;
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid && this.cartItems.length > 0) {
      const order: Order = {
        id: 0,
        items: this.cartItems,
        totalAmount: this.cartTotal,
        customerName: this.checkoutForm.value.customerName,
        customerEmail: this.checkoutForm.value.customerEmail,
        shippingAddress: this.checkoutForm.value.shippingAddress,
        orderDate: new Date(),
        status: 'Pending'
      };

      this.orderService.createOrder(order).subscribe({
        next: (createdOrder) => {
          this.orderConfirmation = createdOrder;
          this.orderPlaced = true;
          this.cartService.clearCart();
        },
        error: (err) => {
          console.error('Error creating order:', err);
          alert('Failed to place order. Please try again.');
        }
      });
    } else {
      Object.keys(this.checkoutForm.controls).forEach(key => {
        const control = this.checkoutForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return 'This field is required';
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors?.['minlength']) {
        return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
