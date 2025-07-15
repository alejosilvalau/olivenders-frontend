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
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(page: number = 1, pageSize: number = 5): Observable<Wizard[]> {
    const params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get<Wizard[]>(this.apiUrl, { params });
  }

  findOne(id: string): Observable<Wizard> {
    return this.http.get<Wizard>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
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
    return this.http.put<Wizard>(`${ this.apiUrl }/${ id }`, formData, { headers: this.authToken.getAuthHeaders() });
  }

  changePasswordWithoutToken(id: string, formData: FormData): Observable<Wizard> {
    return this.http.patch<Wizard>(`${ this.apiUrl }/${ id }`, formData);
  }

  makeAdmin(id: string): Observable<Wizard> {
    return this.http.patch<Wizard>(`${ this.apiUrl }/${ id }/admin`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  makeUser(id: string): Observable<Wizard> {
    return this.http.patch<Wizard>(`${ this.apiUrl }/${ id }/user`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  deactivate(id: string): Observable<Wizard> {
    return this.http.patch<Wizard>(`${ this.apiUrl }/${ id }/deactivate`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  activate(id: string): Observable<Wizard> {
    return this.http.patch<Wizard>(`${ this.apiUrl }/${ id }/activate`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<Wizard> {
    return this.http.delete<Wizard>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }
}
