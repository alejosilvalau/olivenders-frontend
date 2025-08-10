import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderRequest, OrderResponse } from '../models/order.interface.js';
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

  findAll(page: number = 1, pageSize: number = Number.MAX_SAFE_INTEGER): Observable<OrderResponse<Order[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<OrderResponse<Order[]>>(this.apiUrl, { params, headers: this.authToken.getAuthHeaders() });
  }

  findAllByWizard(wizardId: string, page: number = 1, pageSize: number = Number.MAX_SAFE_INTEGER): Observable<OrderResponse<Order[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<OrderResponse<Order[]>>(`${ this.apiUrl }/wizard/${ wizardId }`, { params, headers: this.authToken.getAuthHeaders() });
  }

  findAllByWand(wandId: string, page: number = 1, pageSize: number = Number.MAX_SAFE_INTEGER): Observable<OrderResponse<Order[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<OrderResponse<Order[]>>(`${ this.apiUrl }/wand/${ wandId }`, { params, headers: this.authToken.getAuthHeaders() });
  }

  findOne(id: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  add(orderData: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, orderData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, orderData: OrderRequest): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${ this.apiUrl }/${ id }`, orderData, { headers: this.authToken.getAuthHeaders() });
  }

  pay(id: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${ this.apiUrl }/${ id }/pay`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  dispatch(id: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${ this.apiUrl }/${ id }/dispatch`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  complete(id: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${ this.apiUrl }/${ id }/complete`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  cancel(id: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${ this.apiUrl }/${ id }/cancel`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  refund(id: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${ this.apiUrl }/${ id }/refund`, {}, { headers: this.authToken.getAuthHeaders() });
  }

  review(id: string, orderData: OrderRequest): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${ this.apiUrl }/${ id }/review`, orderData, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<OrderResponse> {
    return this.http.delete<OrderResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }
}
