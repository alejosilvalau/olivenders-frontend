import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./components/auth/auth.routes').then(m => m.authRoutes) },
  {path: 'product', loadChildren: () => import('./components/product/product.routes').then(m => m.productRoutes)},
  { path: '', loadChildren: () => import('./components/product/product.routes').then(m => m.productRoutes) }
];
