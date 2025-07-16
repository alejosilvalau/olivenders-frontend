import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wizard, WizardRequest, WizardResponse } from '../models/wizard.interface.js';
import { AuthToken } from '../../functions/auth-token.function.js';
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

  findAll(page: number = 1, pageSize: number = 5): Observable<WizardResponse<Wizard[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<WizardResponse<Wizard[]>>(this.apiUrl, { params });
  }

  findOne(id: string): Observable<WizardResponse> {
    return this.http.get<WizardResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  findOneByEmail(email: string): Observable<WizardResponse> {
    return this.http.get<WizardResponse>(`${ this.apiUrl }/email/${ email }`);
  }

  findOneByUsername(username: string): Observable<WizardResponse> {
    return this.http.get<WizardResponse>(`${ this.apiUrl }/username/${ username }`);
  }

  isUsernameAvailable(username: string): Observable<WizardResponse<boolean>> {
    return this.http.get<WizardResponse<boolean>>(`${ this.apiUrl }/available/username/${ username }`);
  }

  isEmailAvailable(email: string): Observable<WizardResponse<boolean>> {
    return this.http.get<WizardResponse<boolean>>(`${ this.apiUrl }/available/email/${ email }`);
  }

  add(wizardData: WizardRequest): Observable<WizardResponse> {
    return this.http.post<WizardResponse>(this.apiUrl, wizardData);
  }

  login(wizardData: WizardRequest): Observable<WizardResponse> {
    return this.http.post<WizardResponse>(`${ this.apiUrl }/login`, wizardData);
  }

  validatePassword(id: string, wizardData: WizardRequest): Observable<WizardResponse<boolean>> {
    return this.http.post<WizardResponse<boolean>>(`${ this.apiUrl }/validate/${ id }`, wizardData);
  }

  update(id: string, wizardData: WizardRequest): Observable<WizardResponse> {
    return this.http.put<WizardResponse>(`${ this.apiUrl }/${ id }`, wizardData, { headers: this.authToken.getAuthHeaders() });
  }

  changePasswordWithoutToken(id: string, wizardData: WizardRequest): Observable<WizardResponse> {
    return this.http.patch<WizardResponse>(`${ this.apiUrl }/${ id }`, wizardData);
  }

  makeAdmin(id: string): Observable<WizardResponse> {
    return this.http.patch<WizardResponse>(`${ this.apiUrl }/${ id }/admin`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  makeUser(id: string): Observable<WizardResponse> {
    return this.http.patch<WizardResponse>(`${ this.apiUrl }/${ id }/user`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  deactivate(id: string): Observable<WizardResponse> {
    return this.http.patch<WizardResponse>(`${ this.apiUrl }/${ id }/deactivate`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  activate(id: string): Observable<WizardResponse> {
    return this.http.patch<WizardResponse>(`${ this.apiUrl }/${ id }/activate`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<WizardResponse> {
    return this.http.delete<WizardResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }
}
