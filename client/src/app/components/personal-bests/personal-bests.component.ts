import { Component, OnInit } from '@angular/core';
import { RunningDataService } from '../../services/running-data.service';
import { ThemeService } from '../../services/theme.service';
import { PersonalBest } from '../../types';
import { MatDialog } from '@angular/material/dialog';
import { EditRecordComponent } from './edit-record/edit-record.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-personal-bests',
  templateUrl: './personal-bests.component.html',
  styleUrls: ['./personal-bests.component.scss'],
})
export class PersonalBestsComponent implements OnInit {
  constructor(
    private runningService: RunningDataService,
    private themeService: ThemeService,
    public dialog: MatDialog,
    private toast: ToastrService
  ) {}

  personalBests: any[] = [];
  displayedColumns: string[] = ['Distance', 'Time'];
  darkTheme?: boolean;

  ngOnInit(): void {
    this.darkTheme = this.themeService.getTheme();
    this.themeService.theme$?.subscribe((theme) => {
      this.darkTheme = theme;
    });

    this.getAllPbs();
  }

  getAllPbs() {
    this.runningService.getAllPbs().subscribe((val) => {
      this.personalBests = val;
    });
  }

  editRow(row: PersonalBest) {
    const runObj = {
      distance: row.distance,
      time: row.time,
    };
    this.openEditPbDialog(runObj);
  }

  openEditPbDialog(data: PersonalBest) {
    const dialogRef = this.dialog.open(EditRecordComponent, {
      data: {
        distance: data.distance,
        time: data.time,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((val) => {
      if (val !== 'cancelled') {
        this.runningService.editPb(val.distance, val.time).subscribe({
          error: (error) => console.log('caught an error: ', error),
        });
        setTimeout(() => {
          this.getAllPbs();
          this.toast.success('Personal best updated');
        }, 50);
      } else {
        console.log('cancelled ');
      }
    });
  }
}
