import {Routes} from '@angular/router';
import { SchoolsManagementComponent } from './schools-management/schools-management.component.js';
import { CoresManagementComponent } from './cores-management/cores-management.component.js';
import { WoodsManagementComponent } from './woods-management/woods-management.component.js';
import { QuestionsManagementComponent } from './questions-management/questions-management.component.js';
import { WandCatalogComponent } from './wand-catalog/wand-catalog.component.js';
import { PlaceOrderComponent } from './place-order/place-order.component.js';
import { OrdersDashboardComponent } from './orders-dashboard/orders-dashboard.component.js';
import { OrdersManagementComponent } from './orders-management/orders-management.component.js';

export const productRoutes: Routes = [
  { path: 'schools', component: SchoolsManagementComponent },
  { path: 'cores', component: CoresManagementComponent },
  { path: 'woods', component: WoodsManagementComponent },
  { path: 'questions', component: QuestionsManagementComponent },
  { path: 'orders', component: OrdersManagementComponent },
  { path: 'order/:wandId', component: PlaceOrderComponent },
  { path: 'dashboard', component: OrdersDashboardComponent },
  { path: '', component: WandCatalogComponent },
]
