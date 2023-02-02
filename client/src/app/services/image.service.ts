import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  // API url
  ApiUrl = 'http://localhost:3001/allImages';

  constructor(private http: HttpClient) {}

  getAllImages(): Observable<string[]> {
    return this.http.get<string[]>(this.ApiUrl);
  }
}
