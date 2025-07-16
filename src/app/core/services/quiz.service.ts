import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthToken } from '../../functions/auth-token.function';
import { environment } from '../../../environments/environment';
import { Quiz, QuizRequest, QuizResponse } from '../models/quiz.interface.js';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = `${ environment.apiUrl }/quizzes`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(page: number = 1, pageSize: number = 5): Observable<QuizResponse<Quiz[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<QuizResponse<Quiz[]>>(this.apiUrl, { params, headers: this.authToken.getAuthHeaders() });
  }

  findOne(id: string): Observable<QuizResponse> {
    return this.http.get<QuizResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  add(quizData: QuizRequest): Observable<QuizResponse> {
    return this.http.post<QuizResponse>(this.apiUrl, quizData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, quizData: QuizRequest): Observable<QuizResponse> {
    return this.http.put<QuizResponse>(`${ this.apiUrl }/${ id }`, quizData, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<QuizResponse> {
    return this.http.delete<QuizResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }
}
