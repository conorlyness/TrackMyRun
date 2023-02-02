import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as moment from 'moment';
import { AnalyticsService } from 'src/app/services/analytics.service';
import {
  DailyAvgMonthAndYear,
  DistanceByDay,
  LongestDistance,
  MonthlyTotalMonthAndYear,
  OverallTotal,
  SixMonthTotals,
  WeeklyTotal,
} from 'src/app/types';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  highestMileageDay!: string;
  highestMileage: number = 0;
  totalDistance?: OverallTotal;
  longestDistance?: LongestDistance;
  currentWeeksTotal?: WeeklyTotal;
  monthInYearTotal?: MonthlyTotalMonthAndYear;
  dailyAvgMonthInYear?: DailyAvgMonthAndYear;
  currentYear: string = moment().format('YYYY');
  currentMonth: string = moment().month(moment().format('MMM')).format('M');
  distanceByDayData: DistanceByDay[] = [];
  sixMonthTotalsData: SixMonthTotals[] = [];
  displayMonth: string = moment().month(moment().format('MMM')).format('MMMM');

  months = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  sortedMonths = Object.entries(this.months).sort((a, b) => a[1] - b[1]);

  @ViewChild('distanceByDay', { static: true })
  pieChartContainer!: ElementRef;

  @ViewChild('sixMonthTotalsLine', { static: true })
  lineChartContainer!: ElementRef;

  constructor(private analyticsService: AnalyticsService) {
    Chart.register(ChartDataLabels);
  }

  ngOnInit(): void {
    this.distanceByDays();
    this.last6MonthsTotals();
    this.totalDistanceRan();
    this.longestRun();
    this.currentWeekTotal();
    this.totalDistanceForMonthInYear(+this.currentMonth, +this.currentYear);
    this.dailyAvgForMonthInYear(+this.currentMonth, +this.currentYear);
  }

  distanceByDays() {
    this.analyticsService
      .getDaysOfWeekDistances()
      .subscribe((val: Array<DistanceByDay>) => {
        this.distanceByDayData = val;
        this.distanceByDayData.forEach((el) => {
          if (+el.total_miles > this.highestMileage) {
            this.highestMileage = el.total_miles;
            this.highestMileageDay = el.day_of_week;
          }
        });

        this.populateDistanceByDayPie();
      });
  }

  totalDistanceForMonthInYear(month: number, year: number) {
    this.analyticsService
      .getTotalForMonthInYear(month, year)
      .subscribe((val) => {
        console.log(val);
        this.monthInYearTotal = val;
      });
  }

  dailyAvgForMonthInYear(month: number, year: number) {
    this.analyticsService
      .getDailyAvgForMonthInYear(month, year)
      .subscribe((val) => {
        console.log(val);
        this.dailyAvgMonthInYear = val;
      });
  }

  totalDistanceRan() {
    this.analyticsService.getTotalDistance().subscribe((val) => {
      console.log(val);
      this.totalDistance = val;
    });
  }

  longestRun() {
    this.analyticsService.getLongestRun().subscribe((val) => {
      console.log(val);
      this.longestDistance = val;
    });
  }

  currentWeekTotal() {
    this.analyticsService.getCurrentWeekTotal().subscribe((val) => {
      console.log(val);
      this.currentWeeksTotal = val;
    });
  }

  last6MonthsTotals() {
    this.analyticsService.getLast6MonthsTotals().subscribe((val) => {
      this.sixMonthTotalsData = val;
      this.populateLast6MonthsLine();
    });
  }

  totalAndAverageMonthInYear(month: number, year: number) {
    this.currentYear = year.toString();
    this.getMonthName(month);
    this.dailyAvgForMonthInYear(month, year);
    this.totalDistanceForMonthInYear(month, year);
  }

  getMonthName(monthNumber: number) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    this.displayMonth = date.toLocaleString('en-US', { month: 'long' });
  }

  populateDistanceByDayPie() {
    console.log(this.distanceByDayData);
    let ctx = this.pieChartContainer.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.distanceByDayData.map((x) => x.day_of_week),
        datasets: [
          {
            label: 'Total Miles',
            data: this.distanceByDayData.map((x) => x.total_miles),
            backgroundColor: [
              'rgb(0, 153, 153)',
              'rgb(54, 162, 235)',
              'rgb(255, 15, 84)',
              'rgb(240, 910, 1)',
              'rgb(54, 162, 23)',
              'rgb(195, 65, 84)',
              'rgb(255,122,0)',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            display: false,
            labels: {
              // value: {
              //   color: 'black',
              // },
            },
          },
          legend: {
            position: 'bottom',
            align: 'center',
            labels: {
              color: 'rgb(54, 162, 23)',
              boxWidth: 15,
              font: {
                size: 12,
              },
            },
          },
          title: {
            display: true,
            text: 'Total miles on days of the week',
            font: {
              size: 22,
              family: 'Open Sans',
              weight: 'lighter',
            },
          },
        },
      },
    });
  }

  populateLast6MonthsLine() {
    let ctx = this.lineChartContainer.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.sixMonthTotalsData.map((x) => x.month),
        datasets: [
          {
            label: 'Distance by month',
            data: this.sixMonthTotalsData.map((x) => x.totaldistance),
            fill: false,
            borderColor: 'rgb(15, 123, 20)',
            tension: 0.1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Total Miles in last 6 months',
            font: {
              size: 22,
              family: 'Open Sans',
              weight: 'lighter',
            },
          },
          datalabels: {
            display: false,
          },
        },
      },
    });
  }
}
