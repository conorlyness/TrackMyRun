import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
  dialogAnswer: any;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(
    private runningService: RunningDataService,
    public dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.showAllRunsOnStart();
  }

  showAllRunsOnStart() {
    this.runningService.getAllRuns().subscribe((runs: any) => {
      this.runInfo = runs;
      this.runInfo.forEach((run) => {
        this.totalMiles += Number(run.Distance);
      });
      this.sortedData = this.runInfo.slice();
    });
  }

  search() {
    const startDate = moment(this.range.controls.start.value)
      .format('YYYY-MM-DD')
      .toLocaleString();
    const endDate = moment(this.range.controls.end.value)
      .format('YYYY-MM-DD')
      .toLocaleString();
    const today = moment().format('YYYY-MM-DD').toLocaleString();

    if (endDate < startDate || startDate > today) {
      console.log('start: ', startDate, ' end: ', endDate);
      this.toast.error('The selected range was invalid. Please try again');
      this.range.setValue({
        start: null,
        end: null,
      });
    } else {
      this.totalMiles = 0;
      this.runningService
        .getSpecificRuns(startDate, endDate)
        .subscribe((runs: any) => {
          this.runInfo = runs;
          this.runInfo.forEach((run) => {
            this.totalMiles += Number(run.Distance);
          });
          this.sortedData = this.runInfo.slice();
        });
    }
  }

  clearSearch() {
    this.totalMiles = 0;
    this.showAllRunsOnStart();
    this.range.setValue({
      start: null,
      end: null,
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

  openDialog(data: any) {
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
        this.runningService
          .editRun(
            moment(this.dialogAnswer.date).format('YYYY-MM-DD'),
            this.dialogAnswer.distance,
            this.dialogAnswer.notes
          )
          .subscribe();
        setTimeout(() => {
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
    this.openDialog(runObj);
  }
}
