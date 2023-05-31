import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Shoe } from 'src/app/types';

@Component({
  selector: 'app-high-mileage',
  templateUrl: './high-mileage.component.html',
  styleUrls: ['./high-mileage.component.scss'],
})
export class HighMileageComponent implements OnInit {
  highMileageShoes: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<HighMileageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.data.shoes.forEach((shoe: Shoe) => {
      if (shoe.Distance > 300) {
        this.highMileageShoes.push(shoe);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
