import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wizard } from '../models/wizard.interface.js';
import { AuthToken } from '../../functions/authToken.function';

@Injectable({
  providedIn: 'root',
})
export class WizardService {
  private apiUrl = 'http://localhost:3000/api/wizards';

  constructor(private http: HttpClient) { }

  addWizard(data: FormData): Observable<Wizard> {
    return this.http.post<Wizard>(this.apiUrl, data);
  }
  deleteWizard(wizard: Wizard): Observable<Wizard> {
    const authToken = new AuthToken();
    return this.http.delete<Wizard>(`${ this.apiUrl }/${ wizard.id }`, { headers: authToken.getAuthHeaders() });
  }
  editWizard(wizard: Wizard): Observable<Wizard> {
    const { password, ...wizardWithoutPassword } = wizard;
    const authToken = new AuthToken();
    return this.http.put<Wizard>(`${ this.apiUrl }/${ wizard.id }`, wizardWithoutPassword, { headers: authToken.getAuthHeaders() });
  }

  getAllWizards(): Observable<Wizard[]> {
    const authToken = new AuthToken();
    return this.http.get<Wizard[]>(this.apiUrl, { headers: authToken.getAuthHeaders() });
  }

  getOneWizardByEmailOrUsername(usuario: string, mail: string, excludeWizardId?: string): Observable<Wizard | null> {
    const params = new HttpParams().set('excludeWizardId', excludeWizardId || '');
    return this.http.get<Wizard>(`${ this.apiUrl }/${ usuario }/${ mail }`, { params });
  }

  getOneWizardById(id: string): Observable<Wizard> {
    const authToken = new AuthToken();
    return this.http.get<Wizard>(`${ this.apiUrl }/${ id }`, { headers: authToken.getAuthHeaders() });
  }

  changePassword(id: string, data: any): Observable<Wizard> {
    const authToken = new AuthToken();
    return this.http.patch<Wizard>(`${ this.apiUrl }/${ id }`, data, { headers: authToken.getAuthHeaders() });
  }

  validatePassword(id: string, password: string): Observable<boolean> {
    const authToken = new AuthToken();
    return this.http.post<boolean>(`${ this.apiUrl }/validate/${ id }`, {
      password,
    }, { headers: authToken.getAuthHeaders() });
  }

  checkUsername(username: string): Observable<boolean> {
    const authToken = new AuthToken();
    return this.http.get<boolean>(`${ this.apiUrl }/checkusername/${ username }`, { headers: authToken.getAuthHeaders() });
  }

  checkEmail(email: string): Observable<boolean> {
    const authToken = new AuthToken();
    return this.http.get<boolean>(`${ this.apiUrl }/checkemail/${ email }`, { headers: authToken.getAuthHeaders() });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${ this.apiUrl }/reset`, { token, newPassword });
  }
}
