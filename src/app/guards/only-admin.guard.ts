import { CanActivateFn } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { WizardRole } from '../core/models/wizard.interface';

export const onlyAdmin: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return of(false);
  }

  const currentWizard = authService.getCurrentWizard();

  if (currentWizard && currentWizard.role === WizardRole.Admin) {
    return of(true);
  } else {
    router.navigate(['/']);
    return of(false);
  }
};
