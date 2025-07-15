import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthToken } from '../../functions/authToken.function';
import { environment } from '../../../environments/environment';
import { Quiz } from '../models/quiz.interface.js';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = `${ environment.apiUrl }/quizzes`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(page: number = 1, pageSize: number = 5): Observable<Quiz[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<Quiz[]>(this.apiUrl, { params, headers: this.authToken.getAuthHeaders() });
  }

  findOne(id: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  add(formData: FormData): Observable<Quiz> {
    return this.http.post<Quiz>(this.apiUrl, formData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, formData: FormData): Observable<Quiz> {
    return this.http.put<Quiz>(`${ this.apiUrl }/${ id }`, formData, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<Quiz> {
    return this.http.delete<Quiz>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }
}
