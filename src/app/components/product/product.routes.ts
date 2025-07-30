import {Routes} from '@angular/router';
import { SchoolsManagementComponent } from './schools-management/schools-management.component.js';
import { CoresManagementComponent } from './cores-management/cores-management.component.js';
import { WoodsManagementComponent } from './woods-management/woods-management.component.js';
import { QuestionsManagementComponent } from './questions-management/questions-management.component.js';
import { WandsComponent } from './wands/wands.component.js';

export const productRoutes: Routes = [
  { path: 'schools', component: SchoolsManagementComponent },
  { path: 'cores', component: CoresManagementComponent },
  { path: 'woods', component: WoodsManagementComponent },
  { path: 'questions', component: QuestionsManagementComponent },
  { path: '', component: WandsComponent },
]
