import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthToken } from '../../functions/authToken.function';
import { environment } from '../../../environments/environment';
import { Wand } from '../models/wand.interface.js';

@Injectable({
  providedIn: 'root',
})
export class WandService {
  private apiUrl = `${ environment.apiUrl }/wands`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(page: number = 1, pageSize: number = 5): Observable<Wand[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<Wand[]>(this.apiUrl, { params });
  }

  findAllByCore(coreId: string, page: number = 1, pageSize: number = 5): Observable<Wand[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<Wand[]>(`${ this.apiUrl }/core/${ coreId }`, { params });
  }

  findAllByWood(woodId: string, page: number = 1, pageSize: number = 5): Observable<Wand[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<Wand[]>(`${ this.apiUrl }/wood/${ woodId }`, { params });
  }

  findOne(id: string): Observable<Wand> {
    return this.http.get<Wand>(`${ this.apiUrl }/${ id }`, {});
  }

  add(formData: FormData): Observable<Wand> {
    return this.http.post<Wand>(this.apiUrl, formData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, formData: FormData): Observable<Wand> {
    return this.http.put<Wand>(`${ this.apiUrl }/${ id }`, formData, { headers: this.authToken.getAuthHeaders() });
  }

  markAsAvailable(id: string): Observable<Wand> {
    return this.http.patch<Wand>(`${ this.apiUrl }/${ id }/available`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  markAsSold(id: string): Observable<Wand> {
    return this.http.patch<Wand>(`${ this.apiUrl }/${ id }/sold`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  deactivate(id: string): Observable<Wand> {
    return this.http.patch<Wand>(`${ this.apiUrl }/${ id }/deactivate`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<Wand> {
    return this.http.delete<Wand>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

}
