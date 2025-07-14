import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wizard } from '../models/wizard.interface.js';
import { AuthToken } from '../../functions/authToken.function';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WizardService {
  private apiUrl = `${ environment.apiUrl }/wizards`;

  constructor(private http: HttpClient) { }

  findAll(): Observable<Wizard[]> {
    const authToken = new AuthToken();
    return this.http.get<Wizard[]>(this.apiUrl, { headers: authToken.getAuthHeaders() });
  }

  findOne(id: string): Observable<Wizard> {
    const authToken = new AuthToken();
    return this.http.get<Wizard>(`${ this.apiUrl }/${ id }`, { headers: authToken.getAuthHeaders() });
  }

  findOneByEmail(email: string): Observable<Wizard> {
    return this.http.get<Wizard>(`${ this.apiUrl }/email/${ email }`);
  }

  findOneByUsername(username: string): Observable<Wizard> {
    return this.http.get<Wizard>(`${ this.apiUrl }/username/${ username }`);
  }

  isUsernameAvailable(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${ this.apiUrl }/available/username/${ username }`);
  }

  isEmailAvailable(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${ this.apiUrl }/available/email/${ email }`);
  }

  add(formData: FormData): Observable<Wizard> {
    return this.http.post<Wizard>(this.apiUrl, formData);
  }

  login(formData: FormData): Observable<any> {
    return this.http.post<any>(`${ this.apiUrl }/login`, formData);
  }

  validatePassword(id: string, formData: FormData): Observable<boolean> {
    return this.http.post<boolean>(`${ this.apiUrl }/validate/${ id }`, formData);
  }

  update(id: string, formData: FormData): Observable<Wizard> {
    const authToken = new AuthToken();
    return this.http.put<Wizard>(`${ this.apiUrl }/${ id }`, formData, { headers: authToken.getAuthHeaders() });
  }

  changePasswordWithoutToken(id: string, formData: FormData): Observable<Wizard> {
    return this.http.patch<Wizard>(`${ this.apiUrl }/${ id }`, formData);
  }

  makeAdmin(id: string): Observable<Wizard> {
    const authToken = new AuthToken();
    return this.http.patch<Wizard>(`${ this.apiUrl }/${ id }/admin`, {}, { headers: authToken.getAuthHeaders() });
  }

  makeUser(id: string): Observable<Wizard> {
    const authToken = new AuthToken();
    return this.http.patch<Wizard>(`${ this.apiUrl }/${ id }/user`, {}, { headers: authToken.getAuthHeaders() });
  }

  deactivate(id: string): Observable<Wizard> {
    const authToken = new AuthToken();
    return this.http.patch<Wizard>(`${ this.apiUrl }/${ id }/deactivate`, {}, { headers: authToken.getAuthHeaders() });
  }

  activate(id: string): Observable<Wizard> {
    return this.http.patch<Wizard>(`${ this.apiUrl }/${ id }/activate`, {});
  }

  remove(id: string): Observable<Wizard> {
    const authToken = new AuthToken();
    return this.http.delete<Wizard>(`${ this.apiUrl }/${ id }`, { headers: authToken.getAuthHeaders() });
  }
}
