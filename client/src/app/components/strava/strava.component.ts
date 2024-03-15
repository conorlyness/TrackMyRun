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
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  accessToken: string = '';

  ngOnInit() {
    console.log('STRAVA ON INIT');
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log('PARAMS::', params);
      if (params['code']) {
        let code = params['code'];
        console.log('THE CODE IS::', code);
        localStorage.setItem('stravaCode', code);
        this.stravaService.exchangeAuthorizationCode(code);
        //clear query params as we have our token
        const urlWithoutCode = window.location.pathname;
        window.history.replaceState({}, document.title, urlWithoutCode);
      } else {
        localStorage.setItem('stravaCode', '');
        this.initiateOAuthFlow();
      }
    });
  }

  initiateOAuthFlow(): void {
    console.log('auth with strava');
    localStorage.setItem('accessToken', '');
    if (!localStorage.getItem('accessToken')) {
      this.stravaService.initiateOAuthFlow();
    }
  }
}
