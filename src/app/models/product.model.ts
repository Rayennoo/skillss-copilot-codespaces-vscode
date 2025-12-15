export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  stock: number;
  rating?: number;
  reviews?: number;
}

export enum ProductCategory {
  POMADE = 'Pomade',
  WAX = 'Wax',
  GEL = 'Gel',
  SHAMPOO = 'Shampoo',
  CONDITIONER = 'Conditioner',
  SPRAY = 'Spray',
  BEARD = 'Beard',
  ALL = 'All Products'
}
