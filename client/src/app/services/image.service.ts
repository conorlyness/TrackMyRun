import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Image } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  // API url
  ApiUrl = 'http://localhost:3001/allImages';

  constructor(private http: HttpClient) {}

  getAllImages(): Observable<Image[]> {
    return this.http.get<Image[]>(this.ApiUrl);
  }

  uploadNewImg(
    fileName: string,
    description: string,
    tags: string[]
  ): Observable<HttpStatusCode> {
    const body = { filename: fileName, description: description, tags: tags };
    const url = environment.addImgToDbUrl;
    return this.http.post<HttpStatusCode>(url, body);
  }
}
