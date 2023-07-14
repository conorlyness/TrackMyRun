import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemeService } from './services/theme.service';
import { ElectronService } from './services/electron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  darkThemePref: string = '';
  toggleControl: FormControl<boolean> = new FormControl();
  process!: string;
  darkModeClass = 'darkMode';
  @HostBinding('class') className = '';
  constructor(
    private overlay: OverlayContainer,
    private themeServive: ThemeService,
    private electronService: ElectronService
  ) {}

  ngOnInit() {
    if (typeof process !== 'undefined' && process.versions.electron) {
      this.electronService
        .onOnce('getThemeSettings')
        .then((darkThemeSetting: string) => {
          this.darkThemePref = darkThemeSetting[1];
          this.handleDarkThemePref();
        })
        .catch((error: any) => {
          console.error('Error receiving theme settings:', error);
        });

      this.electronService.send('getThemeSettings');
    } else {
      this.darkThemePref = localStorage.getItem('sliderVal') || '';
      this.handleDarkThemePref();
    }

    this.toggleControl.valueChanges.subscribe((darkMode) => {
      this.className = darkMode ? this.darkModeClass : '';
      if (this.className === this.darkModeClass) {
        this.themeServive.setTheme(true);
        localStorage.setItem('sliderVal', 'true');
        this.electronService.send('setThemeSettings', 'true');
        this.overlay.getContainerElement().classList.add(this.darkModeClass);
      } else {
        this.themeServive.setTheme(false);
        localStorage.setItem('sliderVal', 'false');
        this.electronService.send('setThemeSettings', 'false');
        this.overlay.getContainerElement().classList.remove(this.darkModeClass);
      }
    });
  }

  private handleDarkThemePref(): void {
    if (this.darkThemePref === 'true') {
      this.themeServive.setTheme(true);
      this.toggleControl.setValue(true);
      this.className = this.darkModeClass;
      this.overlay.getContainerElement().classList.add(this.darkModeClass);
    } else {
      this.themeServive.setTheme(false);
      this.toggleControl.setValue(false);
      this.className = '';
      this.overlay.getContainerElement().classList.remove(this.darkModeClass);
    }
  }

  switchTheme() {
    this.toggleControl.setValue(!this.toggleControl.value);
  }
}
