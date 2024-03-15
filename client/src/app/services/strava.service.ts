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
  of,
  retry,
  tap,
  throwError,
} from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StravaService {
  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {}

  clientId = '';
  clientSecret = '';
  stravaCode = '';

  getAthlete(token: any): Observable<any> {
    const url = 'https://www.strava.com/api/v3/athlete';
    return this.http.get<any>(url, {
      params: { access_token: token },
    });
  }

  initiateOAuthFlow(): void {
    const authorizationUrl = `https://www.strava.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=http://localhost:4200/strava&response_type=code&scope=read,activity:read_all,profile:read_all,read_all`;
    window.location.href = authorizationUrl;
  }

  exchangeAuthorizationCode(code: string): void {
    const tokenUrl = 'https://www.strava.com/oauth/token';
    const payload = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      grant_type: 'authorization_code',
    };

    this.http.post<any>(tokenUrl, payload).subscribe(
      (response) => {
        // Store the access token in local storage or a service for future use
        const accessToken = response.access_token;
        localStorage.setItem('accessToken', accessToken);
        console.log('Access token:', accessToken);
        this.getAthlete(accessToken).subscribe((data) => {
          console.log('User data: ', data);
        });
      },
      (error) => {
        console.error(
          'Error exchanging authorization code for access token:',
          error
        );
      }
    );
  }
}
