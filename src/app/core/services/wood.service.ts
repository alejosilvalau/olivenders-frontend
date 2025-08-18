import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthToken } from '../../functions/auth-token.function';
import { environment } from '../../../environments/environment';
import { Wood, WoodRequest, WoodResponse } from '../models/wood.interface';

@Injectable({
  providedIn: 'root',
})
export class WoodService {
  private apiUrl = `${ environment.apiUrl }/woods`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(page: number = 1, pageSize: number = Number.MAX_SAFE_INTEGER): Observable<WoodResponse<Wood[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<WoodResponse<Wood[]>>(this.apiUrl, { params });
  }

  findOne(id: string): Observable<WoodResponse> {
    return this.http.get<WoodResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  findOneByName(name: string): Observable<WoodResponse> {
    return this.http.get<WoodResponse>(`${ this.apiUrl }/name/${ name }`, { headers: this.authToken.getAuthHeaders() });
  }

  add(woodData: WoodRequest): Observable<WoodResponse> {
    return this.http.post<WoodResponse>(this.apiUrl, woodData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, woodData: WoodRequest): Observable<WoodResponse> {
    return this.http.put<WoodResponse>(`${ this.apiUrl }/${ id }`, woodData, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<WoodResponse> {
    return this.http.delete<WoodResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }
}
