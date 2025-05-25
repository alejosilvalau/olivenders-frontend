import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { School } from '../models/school.interface';
import { AuthToken } from '../../functions/authToken.function';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private apiUrl = 'http://localhost:3000/api/schools';

  constructor(private http:HttpClient) { }
  addSchool(school: School): Observable<School> {
    const authToken = new AuthToken();
    return this.http.post<School>(this.apiUrl, school, { headers: authToken.getAuthHeaders()});
  }
  deleteSchool(school: School): Observable<School> {
    const authToken = new AuthToken();
    return this.http.delete<School>(`${this.apiUrl}/${school.id}`, { headers: authToken.getAuthHeaders()});
  }
  editSchool(school: School): Observable<School> {
    const authToken = new AuthToken();
    return this.http.put<School>(`${this.apiUrl}/${school.id}`, school, { headers: authToken.getAuthHeaders()});
  }
  getAllSchools(): Observable<School[]> {
    const authToken = new AuthToken();
    return this.http.get<School[]>(this.apiUrl, { headers: authToken.getAuthHeaders()});
  }
  getOneSchool(id:string): Observable<School> {
    const authToken = new AuthToken();
    return this.http.get<School>(`${this.apiUrl}/${id}`, { headers: authToken.getAuthHeaders()});
  }
  getOneSchoolByName(name: string, excludeSchoolId?: string): Observable<School> {
    const authToken = new AuthToken();
    const params = new HttpParams().set('excludeSchoolId', excludeSchoolId || '');
    return this.http.get<School>(`${this.apiUrl}/find-by-name/${name}`, { params, headers: authToken.getAuthHeaders() } );
  }
}