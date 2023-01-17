import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  darkThemePref: string = localStorage.getItem('sliderVal')!;
  toggleControl = new FormControl();
  @HostBinding('class') className = '';
  constructor(private overlay: OverlayContainer) {}

  ngOnInit() {
    if (this.darkThemePref === 'true') {
      this.toggleControl.setValue(true);
    } else {
      this.toggleControl.setValue(false);
    }

    const darkModeClass = 'darkMode';
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      this.className = darkMode ? darkModeClass : '';
      if (this.className === darkModeClass) {
        localStorage.setItem('sliderVal', 'true');
      } else {
        localStorage.setItem('sliderVal', 'false');
      }
    });

    if (this.darkThemePref === 'true') {
      this.className = darkModeClass;
      this.overlay.getContainerElement().classList.add(darkModeClass);
    } else {
      this.className = '';
      this.overlay.getContainerElement().classList.add('');
    }
  }
}
