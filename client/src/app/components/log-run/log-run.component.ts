import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import * as moment from 'moment';
import { RunningDataService } from 'src/app/services/running-data.service';
import { ToastrService } from 'ngx-toastr';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShoesService } from 'src/app/services/shoes.service';

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
  rpe!: number;
  shoe?: string;
  shoeBrand?: string;
  shoeName?: string;
  tags!: string[];
  @Output() closeDialog = new EventEmitter();
  stepperOrientation!: Observable<StepperOrientation>;
  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private runningService: RunningDataService,
    public dialog: MatDialog,
    private toast: ToastrService,
    private breakpointObserver: BreakpointObserver,
    private shoeService: ShoesService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {}

  confirmSelection() {
    if (!this.distance) {
      this.toast.error('A distance is required');
    } else if (isNaN(this.distance)) {
      this.toast.error('Distance must be a number');
    } else if (!this.shoe) {
      this.toast.error('A shoe must be selected');
    } else {
      this.runningService
        .addNewRun(
          moment(this.date.value).format('YYYY-MM-DD'),
          this.distance,
          this.notes.replace(/'/g, ''),
          this.rpe,
          this.shoe,
          this.tags ? this.tags : []
        )
        .subscribe(() => {
          this.toast.success('Run Successfully Logged');
          if (this.distance && this.shoeBrand && this.shoeName) {
            this.shoeService
              .increaseShoeMileage(this.distance, this.shoeBrand, this.shoeName)
              .subscribe(() => {
                this.distance = undefined;
                this.notes = '';
                this.shoe = '';
                this.closeLogForm('logged');
              });
          }
        });
    }
  }

  closeLogForm(event: string) {
    this.closeDialog.emit(event);
  }

  storeEffort(rpe: number) {
    this.rpe = rpe;
  }

  storeShoe(shoe: any) {
    this.shoe = shoe.displayName;
    this.shoeBrand = shoe.brand;
    this.shoeName = shoe.name;
  }

  next() {
    this.stepper.next();
  }

  previous() {
    this.stepper.previous();
  }

  setTags(tags: string[]) {
    this.tags = tags;
  }
}
