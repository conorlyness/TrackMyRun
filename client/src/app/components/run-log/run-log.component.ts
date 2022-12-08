import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { RunningDataService } from 'src/app/services/running-data.service';
import { MatSort, Sort } from '@angular/material/sort';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { Run } from '../../types';

export type Range = {
  start: any;
  end: any;
};

@Component({
  selector: 'app-run-log',
  templateUrl: './run-log.component.html',
  styleUrls: ['./run-log.component.scss'],
})
export class RunLogComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['RunDate', 'Distance', 'notes'];
  runInfo: Run[] = [];
  //p for page number in pagination
  p: number = 1;
  sortedData!: Run[];
  totalMiles: number = 0;
  dialogAnswer: any;
  todaysDate = moment().format('YYYY-MM-DD');
  last7Filter: boolean = false;
  last14Filter: boolean = false;
  last30Filter: boolean = false;
  private clearRangeSubject: Subject<boolean> = new Subject();
  clearRangeObs$ = this.clearRangeSubject.asObservable();
  rangePicker: boolean = false;
  subscriptions = new Subscription();

  constructor(
    private runningService: RunningDataService,
    public dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.showAllRunsOnStart();
  }

  showAllRunsOnStart() {
    this.subscriptions.add(
      this.runningService.getAllRuns().subscribe({
        next: (runs: Array<Run>) => {
          // runs.forEach((run) => this.runInfo.push(run));
          this.runInfo = runs;
          this.runInfo.forEach((run) => {
            this.totalMiles += Number(run.Distance);
          });
          this.sortedData = this.runInfo.slice();
        },
        error: (error) => console.log('caught an error: ', error),
      })
    );
  }

  search(range: Range) {
    const startDate = moment(range.start).format('YYYY-MM-DD').toLocaleString();
    const endDate = moment(range.end).format('YYYY-MM-DD').toLocaleString();

    if (endDate < startDate || startDate > this.todaysDate.toLocaleString()) {
      console.log('start: ', startDate, ' end: ', endDate);
      this.toast.error('The selected range was invalid. Please try again');
    } else {
      this.last7Filter = false;
      this.last30Filter = false;
      this.last30Filter = false;
      this.totalMiles = 0;
      this.subscriptions.add(
        this.runningService.getSpecificRuns(startDate, endDate).subscribe({
          next: (runs: any) => {
            this.runInfo = runs;
            this.runInfo.forEach((run) => {
              this.totalMiles += Number(run.Distance);
            });
            this.sortedData = this.runInfo.slice();
          },
          error: (error) => console.log('caught an error: ', error),
        })
      );
    }
  }

  clearSearch() {
    this.totalMiles = 0;
    this.showAllRunsOnStart();
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
          if (isAsc) {
            return Number(b.Distance - a.Distance);
          } else {
            return Number(a.Distance - b.Distance);
          }
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  openEditDialog(data: any) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      height: '750px',
      width: '900px',
      data: {
        date: data.date,
        distance: data.distance,
        notes: data.notes,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogAnswer = result;
      if (this.dialogAnswer === undefined) {
        console.log('not correct');
      } else {
        this.toast.success('Run Successfully Updated');
        console.log(this.dialogAnswer);
        this.subscriptions.add(
          this.runningService
            .editRun(
              moment(this.dialogAnswer.date).format('YYYY-MM-DD'),
              this.dialogAnswer.distance,
              this.dialogAnswer.notes
            )
            .subscribe({
              error: (error) => console.log('caught an error: ', error),
            })
        );
        setTimeout(() => {
          this.totalMiles = 0;
          this.showAllRunsOnStart();
        }, 50);
      }
    });
  }

  editRow(row: any) {
    const runObj = {
      date: row.RunDate,
      distance: row.Distance,
      notes: row.Notes,
    };
    console.log('OBJ to edit : ', runObj);
    this.openEditDialog(runObj);
  }

  openFilters() {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      height: '350px',
      width: '600px',
      data: {
        last7: this.last7Filter,
        last14: this.last14Filter,
        last30: this.last30Filter,
        resetToDefault: undefined,
        cancel: false,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('dialog result: ', result);
      this.dialogAnswer = result;
      this.last7Filter = this.dialogAnswer?.last7;
      this.last14Filter = this.dialogAnswer?.last14;
      this.last30Filter = this.dialogAnswer?.last30;
      if (this.dialogAnswer === undefined) {
        console.log('no filters');
      } else if (this.dialogAnswer.cancel) {
        console.log('cancelled filtering');
      } else {
        console.log(this.dialogAnswer);
        if (this.dialogAnswer.last7) {
          this.last7Filter = true;
          this.SearchFromSetDaysAgo(7);
          this.toast.info('Showing runs from last 7 days');
        } else if (this.dialogAnswer.last14) {
          this.last14Filter = true;
          this.SearchFromSetDaysAgo(14);
          this.toast.info('Showing runs from last 14 days');
        } else if (this.dialogAnswer.last30) {
          this.last30Filter = true;
          this.SearchFromSetDaysAgo(30);
          this.toast.info('Showing runs from last 30 days');
        } else if (this.dialogAnswer.resetToDefault) {
          this.last7Filter = false;
          this.last14Filter = false;
          this.last30Filter = false;
          this.clearSearch();
        }
      }
    });
  }

  //a function that will search for runs from a specific amount of days ago
  //eg. passing in 7 will search for runs in the past 7 days
  SearchFromSetDaysAgo(days: number) {
    //the date picker uses the parent subject as an input, the child subscribes to this on init
    //we pass true, the child listens for the event being true and then will clear the date pickers
    this.clearRangeSubject.next(true);
    this.rangePicker = false;
    var endDate = moment(this.todaysDate);

    var startDate = moment();
    startDate = startDate.subtract(days, 'days');

    this.totalMiles = 0;
    this.subscriptions.add(
      this.runningService.getSpecificRuns(startDate, endDate).subscribe({
        next: (runs: Array<Run>) => {
          this.runInfo = runs;
          this.runInfo.forEach((run) => {
            this.totalMiles += Number(run.Distance);
          });
          this.sortedData = this.runInfo.slice();
        },
        error: (error) => console.log('caught an error: ', error),
      })
    );
  }

  toggleRange() {
    this.rangePicker = !this.rangePicker;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
