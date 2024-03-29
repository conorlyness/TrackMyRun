import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
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
import { Run, Range } from '../types';

@Injectable({
  providedIn: 'root',
})
export class RunningDataService {
  constructor(private http: HttpClient) {}

  getAllRuns(): Observable<Run[]> {
    const url = environment.getAllRunsUrl;
    return this.http.get<Run[]>(url, {}).pipe(
      map((runs: any) => {
        //we need to transform the string of tags so its an array
        runs.forEach((run: any) => {
          if (run.tags) {
            run.tags = run.tags.split(',').map((tag: any) => tag.trim());
          }
        });
        return runs;
      }),
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  getRunsByDistance(range: Range): Observable<Run[]> {
    const url = environment.getAllRunsUrl;
    return this.http.get<Run[]>(url, {}).pipe(
      map((runs) =>
        runs.filter(
          (run) => run.distance >= range.start && run.distance <= range.end
        )
      ),
      map((runs: any) => {
        //we need to transform the string of tags so its an array
        runs.forEach((run: any) => {
          if (run.tags) {
            run.tags = run.tags.split(',').map((tag: any) => tag.trim());
          }
        });
        return runs;
      }),
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  getAllPbs(): Observable<any> {
    const url = environment.getAllPbsUrl;
    return this.http.get(url, {}).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  editPb(distance: string, time: string): Observable<any> {
    const url = environment.editPbUrl;
    const body = { distance: distance, time: time };
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  getSpecificRuns(start: string, end: string): Observable<Run[]> {
    const body = { start: start, end: end };
    const url = environment.getSpecificRunsUrl;
    return this.http.post<Run[]>(url, body).pipe(
      map((runs: any) => {
        //we need to transform the string of tags so its an array
        runs.forEach((run: any) => {
          if (run.tags) {
            run.tags = run.tags.split(',').map((tag: any) => tag.trim());
          }
        });
        return runs;
      }),
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  addNewRun(
    runDate: any,
    distance: number,
    notes: string,
    rpe: number,
    shoe: string,
    tags: string[]
  ): Observable<HttpStatusCode> {
    const body = {
      date: runDate,
      distance: distance,
      notes: notes,
      rpe: rpe,
      shoes: shoe,
      tags: tags,
    };
    const url = environment.logNewRunUrl;
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  editRun(
    runDate: any,
    distance: number,
    notes: string,
    rpe: number,
    id: number,
    shoe: string,
    tags: string[]
  ): Observable<HttpStatusCode> {
    const body = {
      date: runDate,
      distance: distance,
      notes: notes,
      rpe: rpe,
      id: id,
      shoe: shoe,
      tags: tags,
    };
    const url = environment.editRunUrl;
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  deleteRun(
    runDate: string,
    distance: number,
    notes: string,
    rpe: number,
    shoe: string
  ): Observable<HttpStatusCode> {
    const body = {
      date: runDate,
      distance: distance,
      notes: notes,
      rpe: rpe,
      shoe: shoe,
    };
    const url = environment.deleteRunUrl;
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(`error caught: ${error.error.message}`));
  }
}
