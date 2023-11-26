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
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ScheduledRun } from 'src/app/types';

export interface DialogData {
  run: ScheduledRun;
}

@Component({
  selector: 'app-edit-run-dialog',
  templateUrl: './edit-run-dialog.component.html',
  styleUrls: ['./edit-run-dialog.component.scss'],
})
export class EditRunDialogComponent {
  subscriptions = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<EditRunDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private scheduleService: ScheduleService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    console.log('OPENED EDIT');
  }

  closeForm() {
    this.dialogRef.close();
  }

  verifyEdit(data: ScheduledRun) {
    console.log('VERIFY EDIT::', data);
    if (!data.distance) {
      this.toast.error('A distance is required');
    } else if (isNaN(data.distance)) {
      this.toast.error('Distance must be a number');
    } else {
      this.subscriptions.add(
        this.scheduleService.editSchedule(data).subscribe({
          error: (error) => console.log('caught an error: ', error),
        })
      );
      this.dialogRef.close('edited');
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
