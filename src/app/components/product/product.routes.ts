import {Routes} from '@angular/router';
import { SchoolManagementComponent } from './school-management/school-management.component.js';
import { CoreManagementComponent } from './core-management/core-management.component.js';
import { WoodManagementComponent } from './woods-management/wood-management.component.js';
import { WandCatalogComponent } from './wand-catalog/wand-catalog.component.js';
import { PlaceOrderComponent } from './place-order/place-order.component.js';
import { OrderDashboardComponent } from './order-dashboard/order-dashboard.component.js';
import { OrderManagementComponent } from './order-management/order-management.component.js';
import { WandManagementComponent } from './wand-management/wand-management.component.js';
import { ReviewListComponent } from './review-list/review-list.component.js';

export const productRoutes: Routes = [
  { path: 'schools', component: SchoolManagementComponent },
  { path: 'cores', component: CoreManagementComponent },
  { path: 'woods', component: WoodManagementComponent },
  { path: 'orders', component: OrderManagementComponent },
  { path: 'wands', component: WandManagementComponent },
  { path: 'order/:wandId', component: PlaceOrderComponent },
  { path: 'reviews', component: ReviewListComponent },
  { path: 'dashboard', component: OrderDashboardComponent },
  { path: '', component: WandCatalogComponent },
]
