import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service.js';
import { Wizard, WizardRole } from '../../../core/models/wizard.interface.js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavBarComponent {
  isLoggedIn: boolean = false;
  currentWizard: Wizard | null = null;
  wizardRole: WizardRole = WizardRole.User;
  isDropdownOpen = false;
  WizardRole = WizardRole;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((authStatus) => {
      this.isLoggedIn = authStatus;
    });

    this.authService.currentWizard$.subscribe((wizard) => {
      this.currentWizard = wizard;
      this.wizardRole = wizard?.role || null;
    });
  }

  logout(): void {
    this.authService.logout();
    this.isDropdownOpen = false;
    this.wizardRole = WizardRole.User;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
