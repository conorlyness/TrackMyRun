import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from 'src/app/services/schedule.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ScheduledRun } from 'src/app/types';

export interface DialogData {
  date: any;
}

@Component({
  selector: 'app-add-run-dialog',
  templateUrl: './add-run-dialog.component.html',
  styleUrls: ['./add-run-dialog.component.scss'],
})
export class AddRunDialogComponent implements OnInit {
  scheduleDate: Date = new Date(Date.now());
  distance!: number;
  notes: string = '';
  isRace: boolean = false;
  disableSchedule: boolean = false;
  stepperOrientation!: Observable<StepperOrientation>;
  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    public dialogRef: MatDialogRef<AddRunDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private breakpointObserver: BreakpointObserver,
    private scheduleService: ScheduleService,
    private toast: ToastrService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    if (this.data.date) {
      this.scheduleDate = this.data.date;
    }
  }

  closeForm() {
    this.dialogRef.close();
  }

  next() {
    this.stepper.next();
  }

  previous() {
    this.stepper.previous();
  }

  confirmSelection() {
    let scheduledRun: ScheduledRun = {
      date: moment(this.scheduleDate).format('YYYY-MM-DD'),
      distance: this.distance,
      notes: this.notes.replace(/'/g, ''),
      completed: false,
      race: this.isRace,
      incomplete: false,
    };
    this.disableSchedule = true;
    this.scheduleService.scheduleRun(scheduledRun).subscribe(
      () => {
        this.toast.success('Run Successfully Scheduled');
        this.disableSchedule = false;
        this.dialogRef.close(scheduledRun);
      },
      (err) => {
        console.log('schedule run err:', err);
        this.disableSchedule = false;
      }
    );
  }
}
