import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Wizard, WizardRequest, WizardResponse } from '../models/wizard.interface.js';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { WizardService } from './wizard.service.js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl = `${ environment.apiUrl }`;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentWizardSubject = new BehaviorSubject<any>(this.getCurrentWizard());
  public currentWizard$ = this.currentWizardSubject.asObservable();

  constructor(private router: Router, private wizardService: WizardService) {
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

  setWizardSession(wizard: Wizard, token: string): void {
    localStorage.setItem('wizard', JSON.stringify(wizard));
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
    this.currentWizardSubject.next(wizard);
  }

  logout(): void {
    localStorage.removeItem('wizard');
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.currentWizardSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('wizard') !== null;
  }

  getCurrentWizard(): Wizard | null {
    const wizardString = localStorage.getItem('wizard');
    return wizardString ? JSON.parse(wizardString) : null;
  }

  getCurrentToken(): string {
    const tokenString = localStorage.getItem('token');
    return tokenString!;
  }
}
