import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthToken } from '../../functions/authToken.function';
import { environment } from '../../../environments/environment';
import { Question } from '../models/question.interface.js';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = `${ environment.apiUrl }/questions`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(page: number = 1, pageSize: number = 5): Observable<Question[]> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<Question[]>(this.apiUrl, { params, headers: this.authToken.getAuthHeaders() });
  }

  findOne(id: string): Observable<Question> {
    return this.http.get<Question>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  add(formData: FormData): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, formData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, formData: FormData): Observable<Question> {
    return this.http.put<Question>(`${ this.apiUrl }/${ id }`, formData, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<Question> {
    return this.http.delete<Question>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

}
