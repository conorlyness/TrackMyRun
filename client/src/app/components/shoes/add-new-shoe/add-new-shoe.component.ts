import { Component, Inject, OnInit } from '@angular/core';
import { DialogData } from '../../gallery/gallery.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-shoe',
  templateUrl: './add-new-shoe.component.html',
  styleUrls: ['./add-new-shoe.component.scss'],
})
export class AddNewShoeComponent implements OnInit {
  brand: string = '';
  name: string = '';

  constructor(public dialogRef: MatDialogRef<AddNewShoeComponent>) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    const data = {
      brand: this.brand,
      name: this.name,
    };
    this.dialogRef.close(data);
  }
}
