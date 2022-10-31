import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { Range } from '../run-log/run-log.component';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
})
export class DateRangePickerComponent implements OnInit {
  @Output() searchRange = new EventEmitter<Range>();
  @Output() clearSearches = new EventEmitter<boolean>();
  @Input() clearRange?: Subject<any>;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor() {}

  ngOnInit(): void {
    this.clearRange?.subscribe((event) => {
      console.log('event from parent: ', event);
      if (event == 'clear') {
        console.log('Need to clear the range');
        this.range.setValue({
          start: null,
          end: null,
        });
      }
    });
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
}
