import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ElectronService } from 'ngx-electron';

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
    private _electronService: ElectronService
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
      this.toggleControl.setValue(true);
      this.className = darkModeClass;
      this.overlay.getContainerElement().classList.add(darkModeClass);
    } else {
      this.toggleControl.setValue(false);
      this.className = '';
      this.overlay.getContainerElement().classList.remove(darkModeClass);
    }

    this.toggleControl.valueChanges.subscribe((darkMode) => {
      this.className = darkMode ? darkModeClass : '';
      if (this.className === darkModeClass) {
        localStorage.setItem('sliderVal', 'true');
        this._electronService.ipcRenderer.sendSync('setThemeSettings', 'true');
        this.overlay.getContainerElement().classList.add(darkModeClass);
      } else {
        localStorage.setItem('sliderVal', 'false');
        this._electronService.ipcRenderer.sendSync('setThemeSettings', 'false');
        this.overlay.getContainerElement().classList.remove(darkModeClass);
      }
    });
  }
}
