import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RunningDataService } from 'src/app/services/running-data.service';
import { MatSort, Sort } from '@angular/material/sort';

export interface Run {
  RunDate: any;
  Distance: number;
  Notes: string;
}

@Component({
  selector: 'app-run-log',
  templateUrl: './run-log.component.html',
  styleUrls: ['./run-log.component.scss'],
})
export class RunLogComponent implements OnInit {
  displayedColumns: string[] = ['RunDate', 'Distance', 'notes'];
  runInfo: any[] = [];
  //p for page number in pagination
  p: number = 1;
  sortedData!: Run[];
  totalMiles: number = 0;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    private snackBar: MatSnackBar,
    private runningService: RunningDataService
  ) {}

  ngOnInit(): void {}

  search() {
    this.totalMiles = 0;
    const startDate = moment(this.range.controls.start.value)
      .format('YYYY-MM-DD')
      .toLocaleString();
    const endDate = moment(this.range.controls.end.value)
      .format('YYYY-MM-DD')
      .toLocaleString();
    const today = moment().format('YYYY-MM-DD').toLocaleString();

    if (endDate < startDate || startDate > today) {
      console.log('start: ', startDate, ' end: ', endDate);
      this.openSnackBar('The selected range has errors. Please try again');
    } else {
      this.runningService
        .getSpecificRuns(startDate, endDate)
        .subscribe((runs: any) => {
          this.runInfo = runs;
          this.runInfo.forEach((run) => {
            this.totalMiles += parseInt(run.Distance);
          });
          this.sortedData = this.runInfo.slice();
          console.log(this.sortedData);
        });
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
    });
  }

  sortData(sort: Sort) {
    const data = this.runInfo.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'RunDate':
          return this.compare(a.RunDate, b.RunDate, isAsc);
        case 'Distance':
          return this.compare(a.Distance, b.Distance, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
