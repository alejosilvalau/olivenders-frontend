import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: 'product', loadChildren: () => import('./components/product/product.routes').then(m => m.productRoutes)},
];
