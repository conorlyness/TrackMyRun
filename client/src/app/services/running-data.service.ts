import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Run } from '../types';

@Injectable({
  providedIn: 'root',
})
export class RunningDataService {
  constructor(private http: HttpClient) {}

  getAllRuns(): Observable<any> {
    const url = environment.getAllRunsUrl;
    return this.http.get<Observable<Run>>(url, {}).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  getSpecificRuns(start: any, end: any): Observable<any> {
    const body = { start: start, end: end };
    const url = environment.getSpecificRunsUrl;
    return this.http.post<Observable<any>>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  addNewRun(
    runDate: any,
    distance: number,
    notes: string,
    rpe: number
  ): Observable<any> {
    const body = { date: runDate, distance: distance, notes: notes, rpe: rpe };
    const url = environment.logNewRunUrl;
    return this.http.post<Observable<any>>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  editRun(
    runDate: any,
    distance: number,
    notes: string,
    rpe: number
  ): Observable<any> {
    const body = { date: runDate, distance: distance, notes: notes, rpe: rpe };
    const url = environment.editRunUrl;
    return this.http.post<Observable<any>>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  deleteRun(runDate: any, distance: number, notes: string): Observable<any> {
    const body = { date: runDate, distance: distance, notes: notes };
    const url = environment.deleteRunUrl;
    return this.http.post<Observable<any>>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(`error caught: ${error.error.message}`));
  }
}
