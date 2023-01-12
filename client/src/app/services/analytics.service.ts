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

  getTotalForMonthInYear(month: number, year: number): Observable<any> {
    const url = environment.getTotalMilesForMonthInYear;
    const body = { month: month, year: year };
    return this.http.post<any>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  getDailyAvgForMonthInYear(month: number, year: number): Observable<any> {
    const url = environment.averageDistancePerDayMonthYear;
    const body = { month: month, year: year };
    return this.http.post<any>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  getTotalDistance(): Observable<any> {
    const url = environment.totalDistanceRan;
    return this.http.get<any>(url, {}).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  getLongestRun(): Observable<any> {
    const url = environment.longestRun;
    return this.http.get<any>(url, {}).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  getCurrentWeekTotal(): Observable<any> {
    const url = environment.currentWeekTotal;
    return this.http.get<any>(url, {}).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  getLast6MonthsTotals(): Observable<any> {
    const url = environment.totalLast6Months;
    return this.http.get<any>(url, {}).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(`error caught: ${error.error.message}`));
  }
}
