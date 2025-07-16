import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthToken } from '../../functions/auth-token.function';
import { environment } from '../../../environments/environment';
import { Question, QuestionRequest, QuestionResponse } from '../models/question.interface.js';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = `${ environment.apiUrl }/questions`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(page: number = 1, pageSize: number = 5): Observable<QuestionResponse<Question[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<QuestionResponse<Question[]>>(this.apiUrl, { params, headers: this.authToken.getAuthHeaders() });
  }

  findOne(id: string): Observable<QuestionResponse> {
    return this.http.get<QuestionResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  add(questionData: QuestionRequest): Observable<QuestionResponse> {
    return this.http.post<QuestionResponse>(this.apiUrl, questionData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, questionData: QuestionRequest): Observable<QuestionResponse> {
    return this.http.put<QuestionResponse>(`${ this.apiUrl }/${ id }`, questionData, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<QuestionResponse> {
    return this.http.delete<QuestionResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

}
