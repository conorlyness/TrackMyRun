import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RunningDataService } from 'src/app/services/running-data.service';
import { DeleteRunComponent } from '../delete-run/delete-run.component';
import { Subscription } from 'rxjs/internal/Subscription';
import * as moment from 'moment';
import { EditDialogData } from 'src/app/types';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent implements OnInit {
  subscriptions = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditDialogData,
    private toast: ToastrService,
    public dialog: MatDialog,
    private runningService: RunningDataService
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  isNaN(value: unknown) {
    if (isNaN(value as number)) {
      return true;
    } else {
      return false;
    }
  }

  verifyEdit(data: EditDialogData) {
    if (!data.distance) {
      this.toast.error('A distance is required');
    } else if (isNaN(data.distance)) {
      this.toast.error('Distance must be a number');
    } else {
      this.subscriptions.add(
        this.runningService
          .editRun(
            moment(data.date).format('YYYY-MM-DD'),
            data.distance,
            data.notes,
            data.rpe,
            data.id
          )
          .subscribe({
            error: (error) => console.log('caught an error: ', error),
          })
      );
      this.dialogRef.close('edited');
    }
  }

  openDeleteDialog(data: EditDialogData) {
    const deleteDialogref = this.dialog.open(DeleteRunComponent, {
      data: {
        date: data.date,
        distance: data.distance,
        notes: data.notes,
        rpe: data.rpe,
      },
      disableClose: true,
    });

    deleteDialogref.componentInstance.delete.subscribe((event) => {
      if (event) {
        this.subscriptions.add(
          this.runningService
            .deleteRun(
              moment(data.date).format('YYYY-MM-DD'),
              data.distance,
              data.notes,
              data.rpe
            )
            .subscribe({
              error: (error) => console.log('caught an error: ', error),
            })
        );
        deleteDialogref.close('deleted run');
        this.dialogRef.close('deleted');
      } else {
        deleteDialogref.close('cancelled delete');
      }
    });

    deleteDialogref.afterClosed().subscribe((event) => {
      console.log(event);
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
