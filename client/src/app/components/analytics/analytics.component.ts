import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { DistanceByDay } from 'src/app/types';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  highestMileageDay!: string;
  highestMileage: number = 0;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.analyticsService
      .getDaysOfWeekDistances()
      .subscribe((val: Array<DistanceByDay>) => {
        console.table(val);

        const arr = val;

        arr.forEach((el) => {
          console.log('the current highest mileage: ', this.highestMileage);
          console.log('the days mileage: ', el.TotalMiles);

          if (+el.TotalMiles.toFixed(2) > this.highestMileage) {
            this.highestMileage = el.TotalMiles;
            this.highestMileageDay = el.DayOfWeek;
          }
        });

        console.log('the higest mileage is AFTER: ', this.highestMileage);
        console.log(
          'The day that the most miles have been done on is: ',
          this.highestMileageDay
        );
      });
  }
}
