import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RunningDataService {

  constructor(private http: HttpClient) { }

  getAllRuns() {
    const url = environment.getAllRunsUrl;
    return this.http.get<Observable<any>>(url, {})
  }

  getSpecificRuns(start: any, end: any) {
    const body = {start: start, end: end};
    const url = environment.getSpecificRuns
    return this.http.post<Observable<any>>(url, body)
  }

  addNewRun(runDate: any, distance: number, notes: string) {
    const body = {date: runDate, distance: distance, notes: notes};
    const url = environment.logNewRun;
    return this.http.post<Observable<any>>(url, body);
  }
}
