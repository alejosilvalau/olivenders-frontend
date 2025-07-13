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

  private currentUserSubject = new BehaviorSubject<any>(this.getCurrentWizard());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
  }

  login(user: string, password: string): Observable<Wizard> {
    return this.http.post<{ user: Wizard, token: string }>(`${ this.apiUrl }/login`, { user, password }).pipe(
      map((response) => {
        const { user, token } = response;
        this.setWizardSession(user, token);
        return user;
      })
    );
  }

  setWizardSession(wizard: Wizard, token: string): void {
    localStorage.setItem('user', JSON.stringify(wizard));
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(wizard);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('user') !== null;
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
