import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-order-confirmation',
  imports: [CommonModule],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css',
  standalone: true
})
export class OrderConfirmation implements OnInit {
  order$!: Observable<Order | undefined>;
  orderId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';
    if (this.orderId) {
      this.order$ = this.orderService.getOrderById(this.orderId);
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
