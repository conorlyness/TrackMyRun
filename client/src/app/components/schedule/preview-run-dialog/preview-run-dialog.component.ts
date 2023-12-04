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
import { EditRunDialogComponent } from '../edit-run-dialog/edit-run-dialog.component';
import { DeleteRunDialogComponent } from '../delete-run-dialog/delete-run-dialog.component';

export interface DialogData {
  date: any;
  run: ScheduledRun;
  completed?: boolean;
  incomplete?: boolean;
}

@Component({
  selector: 'app-preview-run-dialog',
  templateUrl: './preview-run-dialog.component.html',
  styleUrls: ['./preview-run-dialog.component.scss'],
})
export class PreviewRunDialogComponent {
  scheduleDate!: Date;
  scheduledRun!: ScheduledRun;
  previewTitle: string = '';
  buttonsHidden: boolean = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PreviewRunDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private scheduleService: ScheduleService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    if (this.data.date) {
      this.scheduleDate = this.data.date;
    }
    if (this.data.run) {
      this.scheduledRun = this.data.run;
      if (this.scheduledRun.completed) {
        this.previewTitle = 'Completed Run Overview';
        this.buttonsHidden = true;
      } else if (this.scheduledRun.incomplete) {
        this.previewTitle = 'Unable to complete the following';
        this.buttonsHidden = true;
      } else {
        this.previewTitle = 'Run Agenda';
        this.buttonsHidden = false;
      }
    }
  }

  closeForm() {
    this.dialogRef.close();
  }

  openEditForm() {
    const editRunDialogRef = this.dialog.open(EditRunDialogComponent, {
      data: {
        run: this.scheduledRun,
      },
      width: '400px',
      height: '450px',
      disableClose: true,
      autoFocus: false,
    });

    editRunDialogRef?.afterClosed().subscribe(async (event) => {
      if (event === 'edited') {
        this.toast.info(`Run Sucessfully edited`);
        // this.dialogRef.close('edited');
      }
    });
  }

  openDelete() {
    const deleteRunDialogRef = this.dialog.open(DeleteRunDialogComponent, {
      data: {
        date: this.scheduleDate,
        run: this.scheduledRun,
      },
      width: '400px',
      height: '250px',
      disableClose: true,
      autoFocus: false,
    });

    deleteRunDialogRef?.afterClosed().subscribe(async (event) => {
      if (event === 'delete') {
        this.toast.info('Run Sucessfully deleted from schedule');
        this.dialogRef.close('deleted');
      }
    });
  }
}
