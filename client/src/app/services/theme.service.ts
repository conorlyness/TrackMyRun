import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ElectronService } from './electron.service';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject!: Subject<boolean>;
  theme$?: Observable<boolean>;
  darkTheme?: boolean;

  constructor(private electronService: ElectronService) {
    this.themeSubject = new Subject<boolean>();
    this.theme$ = this.themeSubject?.asObservable();
  }

  setTheme(data: boolean) {
    this.themeSubject.next(data);
    this.darkTheme = data;
  }

  getTheme() {
    return this.darkTheme;
  }
}
