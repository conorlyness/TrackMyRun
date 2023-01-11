import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
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
  distanceByDayData: DistanceByDay[] = [];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.distanceByDays();
  }

  ngAfterViewInit() {}

  distanceByDays() {
    this.analyticsService
      .getDaysOfWeekDistances()
      .subscribe((val: Array<DistanceByDay>) => {
        this.distanceByDayData = val;
        console.log(this.distanceByDayData);
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

  totalDistanceForMonthInYear(month: number, year: number) {
    this.analyticsService
      .getTotalForMonthInYear(month, year)
      .subscribe((val) => {
        console.log('the returned data for total in month 1 of 2023');
        console.log(val);
      });
  }

  dailyAvgForMonthInYear(month: number, year: number) {
    this.analyticsService
      .getDailyAvgForMonthInYear(month, year)
      .subscribe((val) => {
        console.log(
          'the returned data for daily average in month 1 of 2023 (aka jan)'
        );
        console.log(val);
      });
  }

  totalDistanceRan() {
    this.analyticsService.getTotalDistance().subscribe((val) => {
      console.log('total distance ran: ', val);
    });
  }

  longestRun() {
    this.analyticsService.getLongestRun().subscribe((val) => {
      console.log('the longest run: ', val);
    });
  }

  currentWeekTotal() {
    this.analyticsService.getCurrentWeekTotal().subscribe((val) => {
      console.log('the current week so far total miles: ', val);
    });
  }
}
