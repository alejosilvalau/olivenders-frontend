import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer } from '../models/answer.interface.js';
import { AuthToken } from '../../functions/authToken.function';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private apiUrl = `${ environment.apiUrl }/answers`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(page: number = 1, pageSize: number = 5): Observable<Answer[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<Answer[]>(this.apiUrl, { params, headers: this.authToken.getAuthHeaders() });
  }

  findOne(id: string): Observable<Answer> {
    return this.http.get<Answer>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  add(formData: FormData): Observable<Answer> {
    return this.http.post<Answer>(this.apiUrl, formData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, formData: FormData): Observable<Answer> {
    return this.http.put<Answer>(`${ this.apiUrl }/${ id }`, formData, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<Answer> {
    return this.http.delete<Answer>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }
}
