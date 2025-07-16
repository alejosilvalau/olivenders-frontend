import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthToken } from '../../functions/auth-token.function';
import { environment } from '../../../environments/environment';
import { School, SchoolRequest, SchoolResponse } from '../models/school.interface.js';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private apiUrl = `${ environment.apiUrl }/schools`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(page: number = 1, pageSize: number = 5): Observable<SchoolResponse<School[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<SchoolResponse<School[]>>(this.apiUrl, { params });
  }

  findOne(id: string): Observable<SchoolResponse> {
    return this.http.get<SchoolResponse>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  findOneByName(name: string): Observable<SchoolResponse> {
    return this.http.get<SchoolResponse>(`${ this.apiUrl }/name/${ name }`, { headers: this.authToken.getAuthHeaders() });
  }

  add(questionData: SchoolRequest): Observable<SchoolResponse> {
    return this.http.post<SchoolResponse>(this.apiUrl, questionData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, formData: FormData): Observable<School> {
    return this.http.put<School>(`${ this.apiUrl }/${ id }`, formData, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<School> {
    return this.http.delete<School>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

}
