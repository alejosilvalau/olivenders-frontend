import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthToken } from '../../functions/auth-token.function';
import { environment } from '../../../environments/environment';
import { Core, CoreRequest, CoreResponse } from '../models/core.interface.js';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private apiUrl = `${ environment.apiUrl }/cores`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(page: number = 1, pageSize: number = Number.MAX_SAFE_INTEGER): Observable<CoreResponse<Core[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<CoreResponse<Core[]>>(this.apiUrl, { params, headers: this.authToken.getAuthHeaders() });
  }

  findOne(id: string): Observable<CoreResponse> {
    return this.http.get<CoreResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  findOneByName(name: string): Observable<CoreResponse> {
    return this.http.get<CoreResponse>(`${ this.apiUrl }/name/${ name }`, { headers: this.authToken.getAuthHeaders() });
  }

  add(coreData: CoreRequest): Observable<CoreResponse> {
    return this.http.post<CoreResponse>(this.apiUrl, coreData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, coreData: CoreRequest): Observable<CoreResponse> {
    return this.http.put<CoreResponse>(`${ this.apiUrl }/${ id }`, coreData, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<CoreResponse> {
    return this.http.delete<CoreResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

}
