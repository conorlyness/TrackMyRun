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
  run: ScheduledRun;
}

@Component({
  selector: 'app-complete-run-dialog',
  templateUrl: './complete-run-dialog.component.html',
  styleUrls: ['./complete-run-dialog.component.scss'],
})
export class CompleteRunDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CompleteRunDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private scheduleService: ScheduleService,
    private toast: ToastrService
  ) {}

  ngOnInit() {}

  closeForm() {
    this.dialogRef.close();
  }

  markComplete() {}

  markIncomplete() {}
}
