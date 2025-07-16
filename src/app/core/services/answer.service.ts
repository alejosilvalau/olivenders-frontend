import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer, AnswerRequest, AnswerResponse } from '../models/answer.interface.js';
import { AuthToken } from '../../functions/auth-token.function.js';
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

  findAll(page: number = 1, pageSize: number = 5): Observable<AnswerResponse<Answer[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<AnswerResponse<Answer[]>>(this.apiUrl, { params, headers: this.authToken.getAuthHeaders() });
  }

  findOne(id: string): Observable<AnswerResponse> {
    return this.http.get<AnswerResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  add(answerData: AnswerRequest): Observable<AnswerResponse> {
    return this.http.post<AnswerResponse>(this.apiUrl, answerData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, answerData: AnswerRequest): Observable<AnswerResponse> {
    return this.http.put<AnswerResponse>(`${ this.apiUrl }/${ id }`, answerData, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<AnswerResponse> {
    return this.http.delete<AnswerResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }
}
