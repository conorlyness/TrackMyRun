import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { Range } from '../../types';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
})
export class DateRangePickerComponent implements OnInit, OnDestroy {
  @Output() searchRange = new EventEmitter<Range>();
  @Output() clearSearches = new EventEmitter<boolean>();
  @Input() clearRange?: Observable<boolean>;

  subscriptions = new Subscription();

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor() {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.clearRange?.subscribe((event) => {
        if (event === true) {
          this.range.setValue({
            start: null,
            end: null,
          });
        }
      })
    );
  }

  search() {
    this.searchRange.emit({
      start: this.range.controls.start.value,
      end: this.range.controls.end.value,
    });
  }

  clearSearch() {
    this.range.setValue({
      start: null,
      end: null,
    });
    this.clearSearches.emit(true);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
