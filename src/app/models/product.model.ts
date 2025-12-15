export interface Product {
  id: number;
  name: string;
  category: 'shampoing' | 'gel' | 'cire' | 'huile' | 'serum' | 'autre';
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  brand: string;
  inStock: boolean;
}
