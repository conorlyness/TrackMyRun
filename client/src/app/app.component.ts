import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trackMyRun';
  showFiller = false;
  @ViewChild('drawer', {static: true}) public sidenav: MatSidenav | undefined;

  
  constructor(private router: Router) { }


  loadLogRun() {
    this.router.navigate(['/']);
    this.sidenav?.toggle();
  }

  loadRunLog() {
    this.router.navigate(['/log']);
    this.sidenav?.toggle();
  }

  loadGallery() {
    this.router.navigate(['/gallery']);
    this.sidenav?.toggle();
  }
}
