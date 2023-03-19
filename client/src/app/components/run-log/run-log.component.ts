import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { RunningDataService } from 'src/app/services/running-data.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { DistanceFilter, EditDialogData, Run, Range } from '../../types';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { MatPaginator } from '@angular/material/paginator';
import { LogRunComponent } from '../log-run/log-run.component';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-run-log',
  templateUrl: './run-log.component.html',
  styleUrls: ['./run-log.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class RunLogComponent implements OnInit, OnDestroy {
  private clearRangeSubject: Subject<boolean> = new Subject();
  displayedColumns: string[] = ['RunDate', 'Distance'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedRow!: Run | null;
  runInfo: Run[] = [];
  sortedData!: Run[];
  totalMiles: number = 0;
  dialogAnswer: any;
  todaysDate = moment().format('YYYY-MM-DD');
  last7Filter: boolean = false;
  last14Filter: boolean = false;
  last30Filter: boolean = false;
  distanceFilter: DistanceFilter = { min: undefined, max: undefined };
  clearRangeObs$ = this.clearRangeSubject.asObservable();
  rangePicker: boolean = false;
  darkTheme!: boolean;
  runningStreak!: number;
  subscriptions = new Subscription();

  //pagination variables
  //p for page number in pagination
  p: number = 1;
  pageSizes = ['10', '25', '50'];
  pageSize = '10';

  @ViewChild(MatTableExporterDirective, { static: true })
  exporter!: MatTableExporterDirective;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private runningService: RunningDataService,
    public dialog: MatDialog,
    private toast: ToastrService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.getTheme().subscribe((theme) => {
      this.darkTheme = theme;
    });
    this.showAllRunsOnStart();
  }

  showAllRunsOnStart() {
    this.subscriptions.add(
      this.runningService.getAllRuns().subscribe({
        next: (runs: Array<Run>) => {
          this.runInfo = runs;
          this.runInfo.forEach((run) => {
            this.totalMiles += Number(run.Distance);
          });
          this.sortedData = this.runInfo.slice();
          this.calculateRunningStreak();
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
      for (const key in this.distanceFilter) {
        if (Object.hasOwnProperty(key)) {
          this.distanceFilter[key as keyof DistanceFilter] = undefined;
        }
      }
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

  searchByDistance(range: Range) {
    this.totalMiles = 0;
    this.subscriptions.add(
      this.runningService.getRunsByDistance(range).subscribe((runs) => {
        this.runInfo = runs;
        this.runInfo.forEach((run) => {
          this.totalMiles += Number(run.Distance);
        });
        this.sortedData = this.runInfo.slice();
      })
    );
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

  openEditDialog(data: EditDialogData) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        date: data.date,
        distance: data.distance,
        notes: data.notes,
        rpe: data.rpe,
        id: data.id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogAnswer = result;
      if (this.dialogAnswer === 'deleted' || this.dialogAnswer === 'edited') {
        this.toast.success(`Successfully ${this.dialogAnswer}`);
        setTimeout(() => {
          this.totalMiles = 0;
          this.showAllRunsOnStart();
        }, 50);
      } else {
        console.log('cancelled');
      }
    });
  }

  editRow(row: any) {
    const runObj = {
      date: row.RunDate,
      distance: row.Distance,
      notes: row.Notes,
      rpe: row.RPE,
      id: row.id,
    };
    this.openEditDialog(runObj);
  }

  openFilters() {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: {
        last7: this.last7Filter,
        last14: this.last14Filter,
        last30: this.last30Filter,
        distance: this.distanceFilter,
        resetToDefault: undefined,
        cancel: false,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogAnswer = result;
      this.last7Filter = this.dialogAnswer?.last7;
      this.last14Filter = this.dialogAnswer?.last14;
      this.last30Filter = this.dialogAnswer?.last30;
      this.distanceFilter = this.dialogAnswer?.distance;
      const { min, max } = this.distanceFilter;
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
          for (const key in this.distanceFilter) {
            if (Object.hasOwnProperty(key)) {
              this.distanceFilter[key as keyof DistanceFilter] = undefined;
            }
          }
          this.clearSearch();
        } else if (min != undefined && max != undefined) {
          const range: Range = {
            start: min,
            end: max,
          };
          this.searchByDistance(range);
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
      this.runningService
        .getSpecificRuns(startDate.toString(), endDate.toString())
        .subscribe({
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

  openExportDialog() {
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      panelClass: 'confirm-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogAnswer = result;
      if (this.dialogAnswer === undefined) {
        console.log('cancelled Downlaod');
      } else {
        this.exportTableData(this.dialogAnswer);
      }
    });
  }

  exportTableData(fileName: string) {
    this.exporter.exportTable('xlsx', {
      fileName: `TMR-${fileName}`,
      sheet: 'RunData',
      Props: { Author: 'Conor Lyness' },
      columnWidths: [100, 20],
    });
  }

  handlePageSizeChange(size: string) {
    this.p = 1;
    this.pageSize = size;
  }

  openLogRun() {
    const dialogRef = this.dialog.open(LogRunComponent, {
      width: '600px',
      height: '750px',
      disableClose: true,
    });

    dialogRef.componentInstance.closeDialog.subscribe((event) => {
      if (event === 'cancel') {
        dialogRef.close('cancel');
      } else if (event === 'logged') {
        dialogRef.close('logged');
      } else {
        dialogRef.close();
      }
    });

    dialogRef.afterClosed().subscribe((event) => {
      if (event === 'cancel') {
      } else if (event === 'logged') {
        this.totalMiles = 0;
        this.showAllRunsOnStart();
      }
    });
  }

  expandRow(event: any, run: Run) {
    this.expandedRow = this.expandedRow === run ? null : run;
    event.stopPropagation();
  }

  calculateRunningStreak() {
    const runs = this.sortedData;
    let runStreak = 0;
    let todaysDate = new Date();

    //check if there is a run logged from today
    if (
      moment(runs[0].RunDate).toString().substring(0, 10) ===
      todaysDate.toString().substring(0, 10)
    ) {
      runStreak++;
    }

    let yesterdaysDate = new Date(
      todaysDate.getFullYear(),
      todaysDate.getMonth(),
      todaysDate.getDate() - 1
    );

    for (let i = 0; i < runs.length; i++) {
      let runDate = moment(runs[i].RunDate);
      if (
        runDate.toString().substring(0, 10) ===
        yesterdaysDate.toString().substring(0, 10)
      ) {
        runStreak++;
        // continue checking previous days
        for (let j = i + 1; j >= 0; j++) {
          let prevRunDate = moment(runs[j].RunDate);

          // check if the previous run was on the day before the current run
          if (
            prevRunDate.toString().substring(0, 10) ===
            moment(runDate).subtract(1, 'days').toString().substring(0, 10)
          ) {
            runStreak++;
            runDate.subtract(1, 'days');
          } else {
            break; // exit the loop if there is no consecutive date
          }
        }
        break; // exit the loop after finding the streak for the most recent run
      }
    }

    this.runningStreak = runStreak;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
