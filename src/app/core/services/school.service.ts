import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthToken } from '../../functions/authToken.function';
import { environment } from '../../../environments/environment';
import { School } from '../models/school.interface.js';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private apiUrl = `${ environment.apiUrl }/schools`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  findAll(): Observable<School[]> {
    const params = new HttpParams().set('page', '1').set('pageSize', '5');
    return this.http.get<School[]>(this.apiUrl, { params, headers: this.authToken.getAuthHeaders() });
  }

  findOne(id: string): Observable<School> {
    return this.http.get<School>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

  findOneByName(name: string): Observable<School> {
    return this.http.get<School>(`${ this.apiUrl }/name/${ name }`);
  }

  add(formData: FormData): Observable<School> {
    return this.http.post<School>(this.apiUrl, formData, { headers: this.authToken.getAuthHeaders() });
  }

  update(id: string, formData: FormData): Observable<School> {
    return this.http.put<School>(`${ this.apiUrl }/${ id }`, formData, { headers: this.authToken.getAuthHeaders() });
  }

  remove(id: string): Observable<School> {
    return this.http.delete<School>(`${ this.apiUrl }/${ id }`, { headers: this.authToken.getAuthHeaders() });
  }

}
