import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.interface.js';
import { AuthToken } from '../../functions/auth-token.function.js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${ environment.apiUrl }/orders`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(page: number = 1, pageSize: number = 5): Observable<Order[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<Order[]>(this.apiUrl, { params, headers: this.authToken.getAuthHeaders() });
  }

  findOne(id: string): Observable<Order> {
    return this.http.get<Order>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  add(formData: FormData): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, formData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, formData: FormData): Observable<Order> {
    return this.http.put<Order>(`${ this.apiUrl }/${ id }`, formData, { headers: this.authToken.getAuthHeaders() });
  }

  pay(id: string): Observable<Order> {
    return this.http.patch<Order>(`${ this.apiUrl }/${ id }/pay`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  dispatch(id: string): Observable<Order> {
    return this.http.patch<Order>(`${ this.apiUrl }/${ id }/dispatch`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  complete(id: string): Observable<Order> {
    return this.http.patch<Order>(`${ this.apiUrl }/${ id }/complete`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  cancel(id: string): Observable<Order> {
    return this.http.patch<Order>(`${ this.apiUrl }/${ id }/cancel`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  refund(id: string): Observable<Order> {
    return this.http.patch<Order>(`${ this.apiUrl }/${ id }/refund`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  review(id: string, formData: FormData): Observable<Order> {
    return this.http.put<Order>(`${ this.apiUrl }/${ id }`, formData, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<Order> {
    return this.http.delete<Order>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }
}
