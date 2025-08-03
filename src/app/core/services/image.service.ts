import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthToken } from '../../functions/auth-token.function';
import { environment } from '../../../environments/environment';
import { ImageResponse } from '../models/image.interface.js';


@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = `${ environment.apiUrl }/images`;
  private authToken: AuthToken;

  constructor(private http: HttpClient) {
    this.authToken = new AuthToken();
  }

  sign(): Observable<ImageResponse> {
    console.log(this.authToken.getAuthHeaders());
    return this.http.post<ImageResponse>(`${ this.apiUrl }/sign`, {}, { headers: this.authToken.getAuthHeaders() });
  }
}
