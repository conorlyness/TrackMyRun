import { NumberSymbol } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { RunningDataService } from 'src/app/services/running-data.service';

export interface DialogData {
  date: any;
  distance: number;
  notes: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  

  currentDate = moment().format('DD-MM-YYYY');
  date = new FormControl(this.currentDate);
  distance?: number;
  notes: string = '';
  dialogAnswer: any;

  constructor(private runningService: RunningDataService, private snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log("CURRENT DATE: " + this.currentDate)
    this.runningService.getAllRuns().subscribe((runs) => {
      console.log(runs);
    })

    let start = moment('2022-07-10').format('YYYY-MM-DD');

    let end = moment('2022-07-30').format('YYYY-MM-DD');
    //  new Date('2022-07-30').toISOString().slice(0, 10);

    console.log(start, end);
    // this.runningService.getSpecificRuns(start, end).subscribe((runs) => {
    //   console.log(runs);
    //   this.runInfo = runs;
    // })

    // let run = {runDate: '2022-07-10', distance: 5, notes: "easy"}
    // console.log(run);

    // this.runningService.addNewRun(run.runDate, run.distance, run.notes).subscribe((runs) => {
    //   console.log(run);
    // })

    let test = moment(start).format('DD-MM-YYYY')


  }


  confirmSelection() {
    let confirmedDate = moment(this.date.value).format('DD-MM-YYYY');
    if ( !this.distance) {
      this.openSnackBar("A distance is required");
    } else if (isNaN(this.distance)) {
      this.openSnackBar("Distance must be a number");
    } else {
      const dialogObj = {date: confirmedDate, distance: this.distance, notes: this.notes} 
      this.openDialog(dialogObj);
    }
   
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 3000
    })
  }

  openDialog(data: any) {
    const dialogRef = this.dialog.open(RunInfoDialog, {
      height: '650px',
      width: '700px',
      panelClass: 'confirm-dialog',
      data: {
        date: data.date,
        distance: data.distance,
        notes: data.notes
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogAnswer = result;
      if (this.dialogAnswer === undefined) {
        console.log("not correct");
      } else {
        this.openSnackBar("Run Successfully Logged")
        this.runningService.addNewRun(this.dialogAnswer.date, this.dialogAnswer.distance, this.dialogAnswer.notes).subscribe();
        this.distance = undefined;
        this.notes = '';
      }
    });
  }
  }


  
@Component({
  selector: 'confirm-run-dialog',
  templateUrl: 'confirmRunDialog.html',
  styleUrls: ['./home.component.scss']
})
export class RunInfoDialog {
  constructor(public dialogRef: MatDialogRef<RunInfoDialog>,@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

