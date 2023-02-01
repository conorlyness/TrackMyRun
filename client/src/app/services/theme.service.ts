import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  initialTheme!: boolean;

  private themeSubject!: BehaviorSubject<boolean>;
  theme$?: Observable<boolean>;
  darkThemePref!: string;

  constructor(private electronService: ElectronService) {
    if (this.electronService.isElectronApp) {
      this.darkThemePref =
        this.electronService.ipcRenderer.sendSync('getThemeSettings');
    } else {
      this.darkThemePref = localStorage.getItem('sliderVal') || '';
    }

    if (this.darkThemePref === 'true') {
      this.themeSubject = new BehaviorSubject(true);
    } else {
      this.themeSubject = new BehaviorSubject(false);
    }
  }

  setTheme(data: boolean) {
    this.themeSubject.next(data);
  }

  getTheme() {
    return (this.theme$ = this.themeSubject.asObservable());
  }
}
