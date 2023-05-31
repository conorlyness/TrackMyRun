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
import { ShoesService } from 'src/app/services/shoes.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent implements OnInit {
  subscriptions = new Subscription();
  distanceBeforeEdit!: number;
  shoeBrand!: string;
  shoeName!: string;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditDialogData,
    private toast: ToastrService,
    public dialog: MatDialog,
    private runningService: RunningDataService,
    private shoeService: ShoesService
  ) {}

  ngOnInit(): void {
    this.distanceBeforeEdit = this.data.distance;
    if (this.data.shoe) {
      const splitIndex = this.data.shoe.indexOf(' ');
      this.shoeBrand = this.data.shoe.slice(0, splitIndex);
      this.shoeName = this.data.shoe.slice(splitIndex + 1);
    }
  }

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
      if (this.data.distance != this.distanceBeforeEdit) {
        this.shoeService
          .decreaseShoeMileage(
            this.distanceBeforeEdit,
            this.shoeBrand,
            this.shoeName
          )
          .subscribe(() => {
            this.shoeService
              .increaseShoeMileage(
                this.data.distance,
                this.shoeBrand,
                this.shoeName
              )
              .subscribe();
          });
      }
      this.subscriptions.add(
        this.runningService
          .editRun(
            moment(data.date).format('YYYY-MM-DD'),
            data.distance,
            data.notes,
            data.rpe,
            data.id,
            data.shoe
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
        shoe: data.shoe,
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
              data.rpe,
              data.shoe
            )
            .subscribe({
              next: () => {
                this.shoeService
                  .decreaseShoeMileage(
                    data.distance,
                    this.shoeBrand,
                    this.shoeName
                  )
                  .subscribe(() => {
                    deleteDialogref.close('deleted run');
                    this.dialogRef.close('deleted');
                  });
              },
              error: (error) => console.log('caught an error: ', error),
            })
        );
      } else {
        deleteDialogref.close('cancelled delete');
      }
    });

    deleteDialogref.afterClosed().subscribe((event) => {
      console.log(event);
    });
  }

  changeShoe(shoe: any) {
    this.data.shoe = shoe.displayName;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
