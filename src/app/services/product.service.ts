import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Initial product data
  private initialProducts: Product[] = [
    {
      id: 1,
      name: 'Shampoing Anti-Chute Advanced',
      category: 'shampoing',
      price: 24.99,
      description: 'Shampoing fortifiant qui réduit la chute des cheveux et stimule la croissance',
      imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400',
      stock: 45,
      brand: 'L\'Oréal Men Expert',
      inStock: true
    },
    {
      id: 2,
      name: 'Gel Coiffant Forte Tenue',
      category: 'gel',
      price: 12.99,
      description: 'Gel coiffant effet mouillé, tenue extrême toute la journée sans résidus',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
      stock: 78,
      brand: 'American Crew',
      inStock: true
    },
    {
      id: 3,
      name: 'Cire Modelante Mat',
      category: 'cire',
      price: 18.50,
      description: 'Cire professionnelle pour un style naturel avec finition mate',
      imageUrl: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400',
      stock: 32,
      brand: 'Gatsby',
      inStock: true
    },
    {
      id: 4,
      name: 'Huile pour Barbe Premium',
      category: 'huile',
      price: 22.00,
      description: 'Huile nourrissante à base d\'argan pour une barbe douce et brillante',
      imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400',
      stock: 0,
      brand: 'Bulldog',
      inStock: false
    },
    {
      id: 5,
      name: 'Sérum Fortifiant Capillaire',
      category: 'serum',
      price: 29.99,
      description: 'Sérum concentré aux vitamines pour renforcer les cheveux fins et fragiles',
      imageUrl: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400',
      stock: 18,
      brand: 'Kérastase Homme',
      inStock: true
    },
    {
      id: 6,
      name: 'Après-Shampoing Hydratant',
      category: 'autre',
      price: 16.50,
      description: 'Après-shampoing hydratant profond pour cheveux secs et abîmés',
      imageUrl: 'https://images.unsplash.com/photo-1585170165499-c34f43df5b80?w=400',
      stock: 56,
      brand: 'Nivea Men',
      inStock: true
    }
  ];

  // BehaviorSubject to manage products reactively
  private productsSubject = new BehaviorSubject<Product[]>(this.initialProducts);
  public products$ = this.productsSubject.asObservable();

  constructor() {}

  /**
   * Get all products
   */
  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  /**
   * Get a product by ID
   */
  getProductById(id: number): Observable<Product> {
    return this.products$.pipe(
      map(products => {
        const product = products.find(p => p.id === id);
        if (!product) {
          throw new Error(`Product with ID ${id} not found`);
        }
        return product;
      })
    );
  }

  /**
   * Add a new product
   */
  addProduct(product: Product): Observable<Product> {
    const currentProducts = this.productsSubject.value;
    
    // Generate new ID
    const maxId = currentProducts.length > 0 
      ? Math.max(...currentProducts.map(p => p.id))
      : 0;
    const newProduct = { ...product, id: maxId + 1 };
    
    // Update products
    const updatedProducts = [...currentProducts, newProduct];
    this.productsSubject.next(updatedProducts);
    
    return of(newProduct);
  }

  /**
   * Update an existing product
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    const currentProducts = this.productsSubject.value;
    const index = currentProducts.findIndex(p => p.id === id);
    
    if (index === -1) {
      return throwError(() => new Error(`Product with ID ${id} not found`));
    }
    
    // Update product
    const updatedProduct = { ...product, id };
    const updatedProducts = [...currentProducts];
    updatedProducts[index] = updatedProduct;
    
    this.productsSubject.next(updatedProducts);
    
    return of(updatedProduct);
  }

  /**
   * Delete a product
   */
  deleteProduct(id: number): Observable<boolean> {
    const currentProducts = this.productsSubject.value;
    const filteredProducts = currentProducts.filter(p => p.id !== id);
    
    if (filteredProducts.length === currentProducts.length) {
      return throwError(() => new Error(`Product with ID ${id} not found`));
    }
    
    this.productsSubject.next(filteredProducts);
    
    return of(true);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.category === category))
    );
  }
}
