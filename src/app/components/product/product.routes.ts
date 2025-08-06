import {Routes} from '@angular/router';
import { SchoolManagementComponent } from './school-management/school-management.component.js';
import { CoreManagementComponent } from './core-management/core-management.component.js';
import { WoodManagementComponent } from './wood-management/wood-management.component.js';
import { WandCatalogComponent } from './wand-catalog/wand-catalog.component.js';
import { PlaceOrderComponent } from './place-order/place-order.component.js';
import { OrderDashboardComponent } from './order-dashboard/order-dashboard.component.js';
import { OrderManagementComponent } from './order-management/order-management.component.js';
import { WandManagementComponent } from './wand-management/wand-management.component.js';
import { ReviewListComponent } from './review-list/review-list.component.js';
import { isLoggedInGuard } from '../../guards/is-logged-in.guard';
import { onlyAdmin } from '../../guards/only-admin.guard.js';

export const productRoutes: Routes = [
  { path: 'schools', component: SchoolManagementComponent, canActivate: [onlyAdmin] },
  { path: 'cores', component: CoreManagementComponent, canActivate: [onlyAdmin] },
  { path: 'woods', component: WoodManagementComponent, canActivate: [onlyAdmin] },
  { path: 'orders', component: OrderManagementComponent, canActivate: [onlyAdmin] },
  { path: 'wands', component: WandManagementComponent, canActivate: [onlyAdmin] },
  { path: 'order/:wandId', component: PlaceOrderComponent, canActivate: [isLoggedInGuard] },
  { path: 'reviews', component: ReviewListComponent },
  { path: 'dashboard', component: OrderDashboardComponent, canActivate: [isLoggedInGuard] },
  { path: '', component: WandCatalogComponent },
]
