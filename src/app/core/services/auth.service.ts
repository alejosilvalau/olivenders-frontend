import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Wizard } from '../models/wizard.interface.js';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl = 'http://localhost:3000/api/wizards';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentWizardSubject = new BehaviorSubject<any>(this.getCurrentWizard());
  public currentWizard$ = this.currentWizardSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
  }

  login(wizard: string, password: string): Observable<Wizard> {
    return this.http.post<{ wizard: Wizard, token: string }>(`${ this.apiUrl }/login`, { wizard, password }).pipe(
      map((response) => {
        const { wizard, token } = response;
        this.setWizardSession(wizard, token);
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
