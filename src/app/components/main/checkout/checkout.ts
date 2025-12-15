import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItem } from '../../../models/cart-item.model';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
  standalone: true
})
export class Checkout implements OnInit {
  checkoutForm!: FormGroup;
  cartItems$!: Observable<CartItem[]>;
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.getCartItems();
    this.updateTotals();

    // Check if cart is empty and redirect
    this.cartItems$.subscribe(items => {
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });

    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      country: ['USA', Validators.required]
    });
  }

  updateTotals(): void {
    this.subtotal = this.cartService.getSubtotal();
    this.tax = this.cartService.getTax();
    this.total = this.cartService.getTotal();
  }

  onSubmit(): void {
    if (this.checkoutForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.checkoutForm.value;
      const customerInfo = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        address: {
          street: formValue.street,
          city: formValue.city,
          state: formValue.state,
          zipCode: formValue.zipCode,
          country: formValue.country
        }
      };

      // Get current cart items
      let cartItems: CartItem[] = [];
      this.cartItems$.subscribe(items => cartItems = items).unsubscribe();

      // Create order
      this.orderService.createOrder(customerInfo, cartItems, this.subtotal, this.tax, this.total)
        .subscribe(order => {
          // Clear cart
          this.cartService.clearCart();
          
          // Navigate to confirmation
          this.router.navigate(['/order-confirmation', order.id]);
        });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (field?.hasError('minLength')) {
      return 'Too short';
    }
    if (field?.hasError('pattern')) {
      if (fieldName === 'phone') {
        return 'Please enter a 10-digit phone number';
      }
      if (fieldName === 'zipCode') {
        return 'Please enter a 5-digit ZIP code';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
