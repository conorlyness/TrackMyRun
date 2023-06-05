import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PersonalBest } from 'src/app/types';

@Component({
  selector: 'app-edit-record',
  templateUrl: './edit-record.component.html',
  styleUrls: ['./edit-record.component.scss'],
})
export class EditRecordComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EditRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonalBest
  ) {}

  hours!: number;
  minutes!: number;
  seconds!: number;

  ngOnInit(): void {
    if (this.data.time === null || this.data.time === 'undefined') {
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
    } else {
      let splittedTime = this.data.time.split(':');
      this.hours = splittedTime[0];
      this.minutes = splittedTime[1];
      this.seconds = splittedTime[2];
    }
  }

  onNoClick(): void {
    this.dialogRef.close('cancelled');
  }

  verifyEdit() {
    this.buildTime(this.hours, this.minutes, this.seconds);
    this.dialogRef.close(this.data);
  }

  buildTime(hours: number, minutes: number, seconds: number) {
    // add leading zeros to ensure each part of the time has two digits
    const paddedHours = hours?.toString().padStart(2, '0') || '00';
    const paddedMinutes = minutes?.toString().padStart(2, '0') || '00';
    const paddedSeconds = seconds?.toString().padStart(2, '0') || '00';

    // concatenate the parts of the time string with the appropriate separator
    const timeString = `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    this.data.time = timeString;
  }
}
