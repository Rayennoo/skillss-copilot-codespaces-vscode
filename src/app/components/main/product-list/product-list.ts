import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product, ProductCategory } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  standalone: true
})
export class ProductList implements OnInit {
  products$!: Observable<Product[]>;
  categories = Object.values(ProductCategory);
  selectedCategory: ProductCategory = ProductCategory.ALL;
  searchQuery: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    if (this.searchQuery.trim()) {
      this.products$ = this.productService.searchProducts(this.searchQuery);
    } else {
      this.products$ = this.productService.getProductsByCategory(this.selectedCategory);
    }
  }

  onCategoryChange(category: ProductCategory): void {
    this.selectedCategory = category;
    this.searchQuery = '';
    this.loadProducts();
  }

  onSearch(): void {
    this.selectedCategory = ProductCategory.ALL;
    this.loadProducts();
  }
}
