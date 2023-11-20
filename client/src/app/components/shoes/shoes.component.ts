import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Shoe } from 'src/app/types';
import { DialogData } from '../gallery/gallery.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AddNewShoeComponent } from './add-new-shoe/add-new-shoe.component';
import { ToastrService } from 'ngx-toastr';
import { ShoesService } from 'src/app/services/shoes.service';

@Component({
  selector: 'app-shoes',
  templateUrl: './shoes.component.html',
  styleUrls: ['./shoes.component.scss'],
})
export class ShoesComponent implements OnInit {
  shoes: Shoe[] = [];
  selectedShoe?: Shoe;
  displayedColumns: string[] = ['Name', 'Distance', 'options'];
  @Input() analyticMode: boolean = false;
  @Output() chosenShoe: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private toast: ToastrService,
    private shoeService: ShoesService
  ) {}

  ngOnInit(): void {
    this.shoeService.getAllShoes().subscribe((shoes) => {
      this.shoes = shoes;
    });
  }

  setShoe(shoe: Shoe) {
    const chosenShoe = {
      brand: shoe.brand,
      name: shoe.name,
      displayName: `${shoe.brand} ${shoe.name}`,
    };
    this.chosenShoe.emit(chosenShoe);
  }

  addNewShoe() {
    const dialogRef = this.dialog.open(AddNewShoeComponent, {
      disableClose: true,
      height: '300px',
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.shoeService
          .addNewShoes(result.brand, result.name)
          .subscribe(() => {
            this.toast.success(
              `Sucessfully added ${result.brand} ${result.name} 👟`
            );
            this.shoeService.getAllShoes().subscribe((shoes) => {
              this.shoes = shoes;
            });
          });
      }
    });
  }

  retireShoe(shoe: Shoe) {
    console.log('going to retire shoe: ', shoe);
    this.shoeService
      .updateShoeStatus(shoe.brand, shoe.name, true)
      .subscribe(() => {
        this.toast.info(
          `${shoe.brand} '' ${shoe.name} has now been retired 👋`
        );
        this.shoeService.getAllShoes().subscribe((shoes) => {
          this.shoes = shoes;
        });
      });
  }

  reactivateShoe(shoe: Shoe) {
    this.shoeService
      .updateShoeStatus(shoe.brand, shoe.name, false)
      .subscribe(() => {
        this.toast.info(
          `${shoe.brand} '' ${shoe.name} has now been reactivated 👟`
        );
        this.shoeService.getAllShoes().subscribe((shoes) => {
          this.shoes = shoes;
        });
      });
  }

  deleteShoe(shoe: Shoe) {
    this.shoeService.deleteShoe(shoe.brand, shoe.name).subscribe(() => {
      this.toast.info(`${shoe.brand} '' ${shoe.name} has been deleted`);
      this.shoeService.getAllShoes().subscribe((shoes) => {
        this.shoes = shoes;
      });
    });
  }
}
