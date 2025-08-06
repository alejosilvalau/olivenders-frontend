import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Wizard, WizardRequest, WizardResponse } from '../models/wizard.interface.js';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { WizardService } from './wizard.service.js';
import { jwtDecode } from 'jwt-decode';
import { alertMethod } from '../../functions/alert.function.js';
import { AlertType } from '../../shared/components/alert/alert.component.js';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl = `${ environment.apiUrl }`;
  private logoutTimer: any;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentWizardSubject = new BehaviorSubject<any>(this.getCurrentWizard());
  public currentWizard$ = this.currentWizardSubject.asObservable();

  constructor(private router: Router, private wizardService: WizardService) {
  }

  getCurrentWizard(): Wizard | null {
    const wizardString = localStorage.getItem('wizard');
    return wizardString ? JSON.parse(wizardString) : null;
  }

  getCurrentToken(): string {
    const tokenString = localStorage.getItem('token');
    return tokenString!;
  }

  setWizardSession(wizard: Wizard, token: string): void {
    localStorage.setItem('wizard', JSON.stringify(wizard));
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
    this.currentWizardSubject.next(wizard);
    this.setAutoLogout(token);
  }

  login(wizardData: WizardRequest): Observable<Wizard | undefined> {
    return this.wizardService.login(wizardData).pipe(
      map((response) => {
        const wizard = response.data;
        const token = response.token;
        this.setWizardSession(wizard!, token!);
        return wizard;
      })
    );
  }

  setAutoLogout(token: string) {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    try {
      const decoded: any = jwtDecode(token);
      if (decoded && decoded.exp) {
        const expiresAt = decoded.exp * 1000;
        const timeout = expiresAt - Date.now();
        if (timeout > 0) {
          this.logoutTimer = setTimeout(() => {
            this.logout();
            alertMethod('Session Expired', 'Your session has expired. Please log in again', AlertType.Info);
          }, timeout);
        } else {
          this.logout();
        }
      }
    } catch (e) {
      this.logout();
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      if (decoded && decoded.exp) {
        return Date.now() < decoded.exp * 1000;
      }
      return false;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('wizard');
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.currentWizardSubject.next(null);
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.router.navigate(['/auth/login']);
  }


}
