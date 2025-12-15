import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  quantity = 1;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadProduct(id);
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = null;

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        setTimeout(() => {
          this.product = product;
          this.loading = false;
          this.cdr.detectChanges();
          this.loadRelatedProducts(product.category);
        }, 0);
      },
      error: (err) => {
        setTimeout(() => {
          this.error = 'Product not found';
          this.loading = false;
          this.cdr.detectChanges();
        }, 0);
        console.error('Error loading product:', err);
      }
    });
  }

  loadRelatedProducts(category: string): void {
    this.productService.getProductsByCategory(category).subscribe({
      next: (products) => {
        setTimeout(() => {
          this.relatedProducts = products
            .filter(p => p.id !== this.product?.id)
            .slice(0, 4);
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('Error loading related products:', err);
      }
    });
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product && this.product.stock > 0) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
      alert(`${this.quantity} x ${this.product.name} added to cart!`);
      this.quantity = 1;
    }
  }

  getStarRating(rating: number | undefined): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('★');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('⯨');
      } else {
        stars.push('☆');
      }
    }
    
    return stars;
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
