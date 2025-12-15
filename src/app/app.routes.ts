import { Routes } from '@angular/router';
import { ProductList } from './components/main/product-list/product-list';
import { ProductDetail } from './components/main/product-detail/product-detail';
import { ShoppingCart } from './components/main/shopping-cart/shopping-cart';
import { Checkout } from './components/main/checkout/checkout';
import { OrderConfirmation } from './components/main/order-confirmation/order-confirmation';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetail },
  { path: 'cart', component: ShoppingCart },
  { path: 'checkout', component: Checkout },
  { path: 'order-confirmation/:orderId', component: OrderConfirmation },
  { path: '**', redirectTo: '/products' }
];
