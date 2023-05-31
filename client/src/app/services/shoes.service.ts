import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import {
  catchError,
  filter,
  map,
  Observable,
  retry,
  tap,
  throwError,
} from 'rxjs';
import { start } from 'repl';
import { environment } from 'src/environments/environment';
import { Shoe, Run } from '../types';
import { stat } from 'fs';

@Injectable({
  providedIn: 'root',
})
export class ShoesService {
  constructor(private http: HttpClient) {}

  getAllShoes(): Observable<Shoe[]> {
    const url = environment.getAllShoesUrl;
    return this.http.get<Shoe[]>(url).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  addNewShoes(brand: string, name: string): Observable<HttpStatusCode> {
    const body = { brand: brand, name: name };
    const url = environment.addNewShoesUrl;
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  increaseShoeMileage(
    distance: number,
    brand: string,
    name: string
  ): Observable<HttpStatusCode> {
    const body = { distance: distance, brand: brand, name: name };
    const url = environment.increaseShoeMileageUrl;
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  decreaseShoeMileage(
    distance: number,
    brand: string,
    name: string
  ): Observable<HttpStatusCode> {
    const body = { distance: distance, brand: brand, name: name };
    const url = environment.decreaseShoeMileageUrl;
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  updateShoeStatus(
    brand: string,
    name: string,
    status: boolean
  ): Observable<HttpStatusCode> {
    const body = { brand: brand, name: name };
    let url;
    if (status) {
      url = environment.retireShoeUrl;
    } else {
      url = environment.reactivateShoeUrl;
    }
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  deleteShoe(brand: string, name: string): Observable<HttpStatusCode> {
    const body = { brand: brand, name: name };
    let url = environment.deleteShoeUrl;
    return this.http.post<HttpStatusCode>(url, body).pipe(
      retry(1),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(`error caught: ${error.error.message}`));
  }
}
