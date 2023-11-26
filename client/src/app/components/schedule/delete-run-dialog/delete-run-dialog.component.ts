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
  selector: 'app-delete-run-dialog',
  templateUrl: './delete-run-dialog.component.html',
  styleUrls: ['./delete-run-dialog.component.scss'],
})
export class DeleteRunDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteRunDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private scheduleService: ScheduleService,
    private toast: ToastrService
  ) {}

  ngOnInit() {}

  deleteRun(runData: ScheduledRun) {
    this.scheduleService.deleteSchedule(runData).subscribe(() => {
      console.log('run sucessfully deleted');
      this.dialogRef.close('delete');
    });
  }

  cancelDelete() {
    this.dialogRef.close();
  }
}
