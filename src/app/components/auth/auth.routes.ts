import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { WizardManagementComponent } from './wizard-management/wizard-management.component';
import { ProfileComponent } from './profile/profile.component';
import { isLoggedInGuard } from '../../guards/is-logged-in.guard';
import { onlyAdmin } from '../../guards/only-admin.guard.js';

export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'wizards', component: WizardManagementComponent, canActivate: [onlyAdmin] },
  { path: 'profile', component: ProfileComponent, canActivate: [isLoggedInGuard] },
];
