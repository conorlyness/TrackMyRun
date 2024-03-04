import { Component } from '@angular/core';
import { StravaService } from 'src/app/services/strava.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-strava',
  templateUrl: './strava.component.html',
  styleUrls: ['./strava.component.scss'],
})
export class StravaComponent {
  constructor(
    private stravaService: StravaService,
    private activatedRoute: ActivatedRoute
  ) {}

  stravaCode: string | null = localStorage.getItem('stravaCode');

  ngOnInit() {
    console.log('STRAVA ON INIT');
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log('PARAMS::', params);
      if (params['code']) {
        console.log('THE CODE IS::', params['code']);
        localStorage.setItem('stravaCode', params['code']);
        this.stravaService.exchangeAuthorizationCode(params['code']);
      } else {
        localStorage.setItem('stravaCode', '');
        this.initiateOAuthFlow();
      }
    });

    if (localStorage.getItem('accessToken')) {
      console.log(
        'we have an access token to use::',
        localStorage.getItem('accessToken')
      );
    }
  }

  initiateOAuthFlow(): void {
    console.log('auth with strava');
    // this.activatedRoute.queryParams.subscribe(async (params) => {
    //   const stravaCode = params['code'];
    //   console.log('strava code::', stravaCode);
    //check local storage for auth code and electron config file***
    if (this.stravaService.stravaCode) {
      //store code somewhere
      console.log('ALREADY AUTHORISED');
    } else {
      this.stravaService.initiateOAuthFlow();
    }
    // });
  }
}
