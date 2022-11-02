import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { RunningDataService } from 'src/app/services/running-data.service';
import { ToastrService } from 'ngx-toastr';

export interface DialogData {
  date: any;
  distance: number;
  notes: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  currentDate = new Date();
  date = new FormControl(this.currentDate);
  distance?: number;
  notes: string = '';
  dialogAnswer: any;

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
      };
      this.openDialog(dialogObj);
    }
  }

  openDialog(data: any) {
    const dialogRef = this.dialog.open(RunInfoDialog, {
      height: '650px',
      width: '700px',
      panelClass: 'confirm-dialog',
      data: {
        date: data.date,
        distance: data.distance,
        notes: data.notes,
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
            this.dialogAnswer.notes.replace(/'/g, '')
          )
          .subscribe();
        this.distance = undefined;
        this.notes = '';
      }
    });
  }
}

@Component({
  selector: 'confirm-run-dialog',
  templateUrl: 'confirmRunDialog.html',
  styleUrls: ['./home.component.scss'],
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
