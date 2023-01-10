import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, retry, Observable, throwError } from 'rxjs';
import { DistanceByDay } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getDaysOfWeekDistances(): Observable<Array<DistanceByDay>> {
    const url = environment.getDaysOfWeekDistanceUrl;
    return this.http.get<Array<DistanceByDay>>(url, {}).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(`error caught: ${error.error.message}`));
  }
}
