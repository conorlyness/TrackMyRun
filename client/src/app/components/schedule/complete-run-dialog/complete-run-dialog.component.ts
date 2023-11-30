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
import { LogRunComponent } from '../../log-run/log-run.component';

export interface DialogData {
  date: Date;
  run: ScheduledRun;
}

@Component({
  selector: 'app-complete-run-dialog',
  templateUrl: './complete-run-dialog.component.html',
  styleUrls: ['./complete-run-dialog.component.scss'],
})
export class CompleteRunDialogComponent {
  runDate!: Date;
  runData!: ScheduledRun;

  constructor(
    public dialogRef: MatDialogRef<CompleteRunDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private scheduleService: ScheduleService,
    private toast: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.data.date) this.runDate = this.data.date;
    if (this.data.run) this.runData = this.data.run;
  }

  closeForm() {
    this.dialogRef.close();
  }

  markComplete() {
    this.scheduleService.completeRun(this.runData).subscribe(() => {
      this.toast.success('Run marked as complete ✅');
      this.dialogRef.close('complete');
    });
  }

  markIncomplete() {
    this.scheduleService.markRunIncomplete(this.runData).subscribe(() => {
      this.toast.info('Run marked as incomplete');
      this.dialogRef.close('incomplete');
    });
  }

  openLogRun() {
    const dialogRef = this.dialog.open(LogRunComponent, {
      width: '550px',
      height: '700px',
      disableClose: true,
      data: {
        date: this.runData.date,
        distance: this.runData.distance,
      },
    });

    dialogRef.componentInstance.closeDialog.subscribe((event: any) => {
      if (event === 'cancel') {
        dialogRef.close('cancel');
      } else if (event === 'logged') {
        dialogRef.close('logged');
      } else {
        dialogRef.close();
      }
    });

    dialogRef.afterClosed().subscribe((event: any) => {
      if (event === 'logged') {
        this.markComplete();
      }
    });
  }
}
