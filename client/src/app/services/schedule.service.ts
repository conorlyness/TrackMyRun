import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
  catchError,
  filter,
  map,
  Observable,
  retry,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { ScheduledRun } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor(private http: HttpClient) {}

  getAllScheduledRuns(
    startDate: Date,
    endDate: Date
  ): Observable<ScheduledRun[]> {
    const body = { start: startDate, end: endDate };
    console.log('getting these dates::', body);
    const url = environment.runScheduleUrl;
    return this.http.post<any>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  scheduleRun(run: ScheduledRun): Observable<HttpStatusCode> {
    console.log('Passed in run to schedule::', run);
    const body = {
      date: run.date,
      distance: run.distance,
      notes: run.notes,
      completed: run.completed,
      race: run.race,
      incomplete: run.incomplete,
    };
    const url = environment.addScheduleUrl;
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  editSchedule(run: ScheduledRun): Observable<HttpStatusCode> {
    const body = {
      date: run.date,
      distance: run.distance,
      notes: run.notes,
      race: run.race,
    };
    const url = environment.editScheduleUrl;
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  deleteSchedule(run: ScheduledRun): Observable<HttpStatusCode> {
    const body = {
      date: run.date,
      distance: run.distance,
    };
    const url = environment.deleteScheduleUrl;
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  completeRun(run: ScheduledRun): Observable<HttpStatusCode> {
    const body = { date: run.date };
    const url = environment.completeRunUrl;
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  markRunIncomplete(run: ScheduledRun): Observable<HttpStatusCode> {
    const body = { date: run.date };
    const url = environment.incompleteRunUrl;
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(`error caught: ${error.error.message}`));
  }
}
