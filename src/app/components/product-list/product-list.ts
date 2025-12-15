import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['All', 'Pomade', 'Wax', 'Gel', 'Shampoo', 'Conditioner', 'Beard Care'];
  selectedCategory = 'All';
  loading = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    
    this.route.queryParams.subscribe(params => {
      const searchQuery = params['search'];
      if (searchQuery) {
        this.searchProducts(searchQuery);
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProducts().subscribe({
      next: (products) => {
        setTimeout(() => {
          this.products = products;
          this.filteredProducts = products;
          this.loading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        setTimeout(() => {
          this.error = 'Failed to load products. Please try again later.';
          this.loading = false;
          this.cdr.detectChanges();
        }, 0);
        console.error('Error loading products:', err);
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    
    if (category === 'All') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category === category);
    }
  }

  searchProducts(query: string): void {
    this.productService.searchProducts(query).subscribe({
      next: (products) => {
        this.filteredProducts = products;
        this.selectedCategory = 'All';
      },
      error: (err) => {
        console.error('Error searching products:', err);
      }
    });
  }

  addToCart(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (product.stock > 0) {
      this.cartService.addToCart(product);
      alert(`${product.name} added to cart!`);
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
}
