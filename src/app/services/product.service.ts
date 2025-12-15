import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = '/assets/data/products.json';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      map(products => {
        const product = products.find(p => p.id === id);
        if (!product) {
          throw new Error(`Product with id ${id} not found`);
        }
        return product;
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      map(products => products.filter(p => p.category === category))
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      map(products => {
        const lowerQuery = query.toLowerCase();
        return products.filter(p => 
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.brand.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
        );
      })
    );
  }
}
