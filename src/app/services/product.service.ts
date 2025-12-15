import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product, ProductCategory } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>(this.getSampleProducts());
  public products$ = this.productsSubject.asObservable();

  constructor() { }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  getProductsByCategory(category: ProductCategory): Observable<Product[]> {
    if (category === ProductCategory.ALL) {
      return this.products$;
    }
    return this.products$.pipe(
      map(products => products.filter(p => p.category === category))
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
      return this.products$;
    }
    return this.products$.pipe(
      map(products => products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      ))
    );
  }

  private getSampleProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Classic Strong Hold Pomade',
        description: 'High shine, strong hold pomade perfect for classic hairstyles. Water-based formula washes out easily.',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1585821569331-f071db2abd8d?w=400&h=400&fit=crop',
        category: ProductCategory.POMADE,
        stock: 45,
        rating: 4.5,
        reviews: 128
      },
      {
        id: '2',
        name: 'Matte Finish Hair Wax',
        description: 'Medium hold, matte finish wax for natural-looking styles. Great for textured, casual looks.',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1599351431613-66b5d1f4a5af?w=400&h=400&fit=crop',
        category: ProductCategory.WAX,
        stock: 32,
        rating: 4.7,
        reviews: 95
      },
      {
        id: '3',
        name: 'Ultra Hold Styling Gel',
        description: 'Maximum hold gel for all-day control. Perfect for spiky and slicked-back styles.',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
        category: ProductCategory.GEL,
        stock: 58,
        rating: 4.3,
        reviews: 76
      },
      {
        id: '4',
        name: 'Volumizing Shampoo',
        description: 'Professional volumizing shampoo for fuller, thicker-looking hair. Sulfate-free formula.',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1556228994-da5e42e07b0c?w=400&h=400&fit=crop',
        category: ProductCategory.SHAMPOO,
        stock: 67,
        rating: 4.6,
        reviews: 142
      },
      {
        id: '5',
        name: 'Strengthening Conditioner',
        description: 'Nourishing conditioner that strengthens hair and prevents breakage. Moisturizes without weighing down.',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
        category: ProductCategory.CONDITIONER,
        stock: 54,
        rating: 4.5,
        reviews: 118
      },
      {
        id: '6',
        name: 'Flexible Hold Hair Spray',
        description: 'Light, flexible hold spray that keeps your style in place without stiffness. Brushable formula.',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1622016863219-7c0c3a9856b3?w=400&h=400&fit=crop',
        category: ProductCategory.SPRAY,
        stock: 41,
        rating: 4.4,
        reviews: 89
      },
      {
        id: '7',
        name: 'Premium Beard Oil',
        description: 'Nourishing beard oil with natural ingredients. Softens, conditions, and adds healthy shine.',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1621607510016-8b6b88fc7fbc?w=400&h=400&fit=crop',
        category: ProductCategory.BEARD,
        stock: 38,
        rating: 4.8,
        reviews: 156
      },
      {
        id: '8',
        name: 'Light Hold Pomade',
        description: 'Lightweight pomade for natural styles. Low shine, easy to restyle throughout the day.',
        price: 17.99,
        image: 'https://images.unsplash.com/photo-1585821569331-f071db2abd8d?w=400&h=400&fit=crop',
        category: ProductCategory.POMADE,
        stock: 29,
        rating: 4.2,
        reviews: 71
      },
      {
        id: '9',
        name: 'Clay Hair Wax',
        description: 'Clay-based wax for maximum texture and hold. Creates separation and definition.',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1599351431613-66b5d1f4a5af?w=400&h=400&fit=crop',
        category: ProductCategory.WAX,
        stock: 44,
        rating: 4.6,
        reviews: 103
      },
      {
        id: '10',
        name: 'Wet Look Styling Gel',
        description: 'High-shine gel for that wet-look finish. Strong hold that lasts all day.',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
        category: ProductCategory.GEL,
        stock: 51,
        rating: 4.1,
        reviews: 62
      },
      {
        id: '11',
        name: 'Moisturizing Shampoo',
        description: 'Hydrating shampoo for dry hair. Restores moisture and natural oils.',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1556228994-da5e42e07b0c?w=400&h=400&fit=crop',
        category: ProductCategory.SHAMPOO,
        stock: 72,
        rating: 4.4,
        reviews: 98
      },
      {
        id: '12',
        name: 'Maximum Hold Hair Spray',
        description: 'Extra strong hold spray for styles that need to last. Wind and humidity resistant.',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1622016863219-7c0c3a9856b3?w=400&h=400&fit=crop',
        category: ProductCategory.SPRAY,
        stock: 36,
        rating: 4.5,
        reviews: 84
      },
      {
        id: '13',
        name: 'Beard Balm',
        description: 'Styling balm for beards. Tames flyaways and provides light hold with a natural finish.',
        price: 17.99,
        image: 'https://images.unsplash.com/photo-1621607510016-8b6b88fc7fbc?w=400&h=400&fit=crop',
        category: ProductCategory.BEARD,
        stock: 42,
        rating: 4.7,
        reviews: 127
      },
      {
        id: '14',
        name: 'Anti-Dandruff Shampoo',
        description: 'Therapeutic shampoo that fights dandruff and soothes scalp irritation.',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1556228994-da5e42e07b0c?w=400&h=400&fit=crop',
        category: ProductCategory.SHAMPOO,
        stock: 48,
        rating: 4.6,
        reviews: 134
      },
      {
        id: '15',
        name: 'Texturizing Sea Salt Spray',
        description: 'Beach-inspired spray that adds volume and texture. Perfect for casual, wavy styles.',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1622016863219-7c0c3a9856b3?w=400&h=400&fit=crop',
        category: ProductCategory.SPRAY,
        stock: 55,
        rating: 4.3,
        reviews: 79
      }
    ];
  }
}
