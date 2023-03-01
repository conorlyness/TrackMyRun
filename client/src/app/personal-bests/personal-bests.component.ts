import { Component, OnInit } from '@angular/core';
import { RunningDataService } from '../services/running-data.service';
import { ThemeService } from '../services/theme.service';
import { PersonalBest } from '../types';

@Component({
  selector: 'app-personal-bests',
  templateUrl: './personal-bests.component.html',
  styleUrls: ['./personal-bests.component.scss'],
})
export class PersonalBestsComponent implements OnInit {
  constructor(
    private runningService: RunningDataService,
    private themeService: ThemeService
  ) {}

  personalBests: any[] = [];
  displayedColumns: string[] = ['Distance', 'Time'];
  darkTheme!: boolean;

  ngOnInit(): void {
    this.themeService.getTheme().subscribe((theme) => {
      this.darkTheme = theme;
    });

    this.runningService.getAllPbs().subscribe((val) => {
      console.log('ALL PBS: ', val);
      this.personalBests = val;
      console.log(this.personalBests);
    });
  }

  editRow(row: PersonalBest) {
    const runObj = {
      Distance: row.Distance,
      Time: row.Time,
    };
    this.openEditPbDialog(runObj);
  }

  openEditPbDialog(data: PersonalBest) {
    console.log('passed in pb: ', data);
  }
}
