import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MonthAndYear } from 'src/app/types';

@Component({
  selector: 'app-month-year-selects',
  templateUrl: './month-year-selects.component.html',
  styleUrls: ['./month-year-selects.component.scss'],
})
export class MonthYearSelectsComponent implements OnInit {
  constructor() {}

  @Input() currentYear!: string;
  @Input() currentMonth!: string;
  @Input() months!: Array<any>;
  @Output() monthYearSelection = new EventEmitter<MonthAndYear>();

  ngOnInit(): void {}

  monthAndYear(month: number, year: number) {
    this.monthYearSelection.emit({ month: month, year: year });
  }
}
