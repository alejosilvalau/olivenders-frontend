import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthToken } from '../../functions/auth-token.function';
import { environment } from '../../../environments/environment';
import { Wand, WandRequest, WandResponse } from '../models/wand.interface.js';

@Injectable({
  providedIn: 'root',
})
export class WandService {
  private apiUrl = `${ environment.apiUrl }/wands`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(page: number = 1, pageSize: number = 5): Observable<WandResponse<Wand[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<WandResponse<Wand[]>>(this.apiUrl, { params });
  }

  findAllByCore(coreId: string, page: number = 1, pageSize: number = 5): Observable<WandResponse<Wand[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<WandResponse<Wand[]>>(`${ this.apiUrl }/core/${ coreId }`, { params });
  }

  findAllByWood(woodId: string, page: number = 1, pageSize: number = 5): Observable<WandResponse<Wand[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<WandResponse<Wand[]>>(`${ this.apiUrl }/wood/${ woodId }`, { params });
  }

  findOne(id: string): Observable<WandResponse> {
    return this.http.get<WandResponse>(`${ this.apiUrl }/${ id }`, {});
  }

  findOneByName(name: string): Observable<WandResponse> {
    return this.http.get<WandResponse>(`${ this.apiUrl }/name/${ name }`);
  }

  add(formData: FormData): Observable<WandResponse> {
    return this.http.post<WandResponse>(this.apiUrl, formData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, formData: FormData): Observable<WandResponse> {
    return this.http.put<WandResponse>(`${ this.apiUrl }/${ id }`, formData, { headers: this.authToken.getAuthHeaders() });
  }

  markAsAvailable(id: string): Observable<WandResponse> {
    return this.http.patch<WandResponse>(`${ this.apiUrl }/${ id }/available`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  markAsSold(id: string): Observable<WandResponse> {
    return this.http.patch<WandResponse>(`${ this.apiUrl }/${ id }/sold`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  deactivate(id: string): Observable<WandResponse> {
    return this.http.patch<WandResponse>(`${ this.apiUrl }/${ id }/deactivate`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<WandResponse> {
    return this.http.delete<WandResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

}
