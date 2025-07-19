import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service.js';
import { Wizard, WizardRole } from '../../../core/models/wizard.interface.js';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isLoggedIn: boolean = false;
  currentWizard: Wizard | null = null;
  wizardRole: WizardRole | null = null;
  isDropdownOpen = false;

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
    this.wizardRole = null;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
