import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import * as moment from 'moment';
import { RunningDataService } from 'src/app/services/running-data.service';
import { ToastrService } from 'ngx-toastr';

export interface DialogData {
  date: any;
  distance: number;
  notes: string;
  rpe: number;
}

@Component({
  selector: 'app-log-run',
  templateUrl: './log-run.component.html',
  styleUrls: ['./log-run.component.scss'],
})
export class LogRunComponent implements OnInit {
  currentDate = new Date();
  date = new FormControl(this.currentDate);
  distance?: number;
  notes: string = '';
  dialogAnswer: any;
  rpe?: number;
  @Output() closeDialog = new EventEmitter();

  constructor(
    private runningService: RunningDataService,
    public dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {}

  confirmSelection() {
    if (!this.distance) {
      this.toast.error('A distance is required');
    } else if (isNaN(this.distance)) {
      this.toast.error('Distance must be a number');
    } else {
      const dialogObj = {
        date: this.date.value,
        distance: this.distance,
        notes: this.notes,
        rpe: this.rpe,
      };
      this.openDialog(dialogObj);
    }
  }

  openDialog(data: any) {
    console.log(data);
    const dialogRef = this.dialog.open(RunInfoDialog, {
      panelClass: 'confirm-dialog',
      data: {
        date: data.date,
        distance: data.distance,
        notes: data.notes,
        rpe: data.rpe,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogAnswer = result;
      if (this.dialogAnswer === undefined) {
        console.log('cancelled selection');
      } else {
        this.toast.success('Run Successfully Logged');
        this.runningService
          .addNewRun(
            moment(this.dialogAnswer.date).format('YYYY-MM-DD'),
            this.dialogAnswer.distance,
            this.dialogAnswer.notes.replace(/'/g, ''),
            this.dialogAnswer.rpe
          )
          .subscribe();
        this.distance = undefined;
        this.notes = '';
        this.closeLogForm('logged');
      }
    });
  }

  closeLogForm(event: string) {
    this.closeDialog.emit(event);
  }

  storeEffort(rpe: number) {
    this.rpe = rpe;
  }
}

@Component({
  selector: 'confirm-run-dialog',
  templateUrl: 'confirmRunDialog.html',
  styleUrls: ['./log-run.component.scss'],
})
export class RunInfoDialog {
  constructor(
    public dialogRef: MatDialogRef<RunInfoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
