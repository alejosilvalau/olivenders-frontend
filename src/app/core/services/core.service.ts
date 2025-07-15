import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthToken } from '../../functions/auth-token.function';
import { environment } from '../../../environments/environment';
import { Core } from '../models/core.interface.js';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private apiUrl = `${ environment.apiUrl }/cores`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(page: number = 1, pageSize: number = 5): Observable<Core[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<Core[]>(this.apiUrl, { params, headers: this.authToken.getAuthHeaders() });
  }

  findOne(id: string): Observable<Core> {
    return this.http.get<Core>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  findOneByName(name: string): Observable<Core> {
    return this.http.get<Core>(`${ this.apiUrl }/name/${ name }`, { headers: this.authToken.getAuthHeaders() });
  }

  add(formData: FormData): Observable<Core> {
    return this.http.post<Core>(this.apiUrl, formData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, formData: FormData): Observable<Core> {
    return this.http.put<Core>(`${ this.apiUrl }/${ id }`, formData, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<Core> {
    return this.http.delete<Core>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

}
