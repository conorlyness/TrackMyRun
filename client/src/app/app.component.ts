import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ElectronService } from 'ngx-electron';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  darkThemePref: string = '';
  toggleControl = new FormControl();
  @HostBinding('class') className = '';
  constructor(
    private overlay: OverlayContainer,
    private _electronService: ElectronService,
    private themeServive: ThemeService
  ) {}

  ngOnInit() {
    if (this._electronService.isElectronApp) {
      this.darkThemePref =
        this._electronService.ipcRenderer.sendSync('getThemeSettings');
    } else {
      this.darkThemePref = localStorage.getItem('sliderVal') || '';
    }

    const darkModeClass = 'darkMode';
    if (this.darkThemePref === 'true') {
      this.themeServive.setTheme(true);
      this.toggleControl.setValue(true);
      this.className = darkModeClass;
      this.overlay.getContainerElement().classList.add(darkModeClass);
    } else {
      this.themeServive.setTheme(false);
      this.toggleControl.setValue(false);
      this.className = '';
      this.overlay.getContainerElement().classList.remove(darkModeClass);
    }

    this.toggleControl.valueChanges.subscribe((darkMode) => {
      this.className = darkMode ? darkModeClass : '';
      if (this.className === darkModeClass) {
        if (this._electronService.isElectronApp) {
          this._electronService.ipcRenderer.sendSync(
            'setThemeSettings',
            'true'
          );
        }
        this.themeServive.setTheme(true);
        localStorage.setItem('sliderVal', 'true');
        this.overlay.getContainerElement().classList.add(darkModeClass);
      } else {
        this.themeServive.setTheme(false);
        localStorage.setItem('sliderVal', 'false');
        if (this._electronService.isElectronApp) {
          this._electronService.ipcRenderer.sendSync(
            'setThemeSettings',
            'false'
          );
        }
        this.overlay.getContainerElement().classList.remove(darkModeClass);
      }
    });
  }

  switchTheme() {
    this.toggleControl.setValue(!this.toggleControl.value);
  }
}
