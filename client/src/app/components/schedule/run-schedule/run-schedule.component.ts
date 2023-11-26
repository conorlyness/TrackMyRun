import { Component, OnInit } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddRunDialogComponent } from '../add-run-dialog/add-run-dialog.component';
import { CalendarDay, ScheduledRun } from 'src/app/types';
import { ScheduleService } from 'src/app/services/schedule.service';
import * as moment from 'moment';
import { EditRunDialogComponent } from '../edit-run-dialog/edit-run-dialog.component';
import { PreviewRunDialogComponent } from '../preview-run-dialog/preview-run-dialog.component';
import { CompleteRunDialogComponent } from '../complete-run-dialog/complete-run-dialog.component';

@Component({
  selector: 'app-run-schedule',
  templateUrl: './run-schedule.component.html',
  styleUrls: ['./run-schedule.component.scss'],
})
export class RunScheduleComponent implements OnInit {
  monthView: boolean = true;
  currentDate: Date = new Date();
  startOfWeek: Date = this.getStartOfWeek(this.currentDate);
  selectedMonthYear: Date = new Date();
  monthOnUI: number = this.selectedMonthYear.getMonth() + 1;
  yearOnUI: number = this.selectedMonthYear.getFullYear();
  weeksInMonth: CalendarDay[][] = [];
  currentWeekDays: CalendarDay[] = [];
  scheduledRuns: ScheduledRun[] = [];
  startOfCurrentMonth: Date = new Date(
    this.selectedMonthYear.getFullYear(),
    this.selectedMonthYear.getMonth(),
    1
  );
  endOfCurrentMonth: Date = new Date(
    this.selectedMonthYear.getFullYear(),
    this.selectedMonthYear.getMonth() + 1,
    0
  );

  constructor(
    public dialog: MatDialog,
    private toast: ToastrService,
    private scheduleService: ScheduleService
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('current date::', this.currentDate);
    await this.getScheduledRuns(
      this.startOfCurrentMonth,
      this.endOfCurrentMonth
    );
    this.generateSchedule();
  }

  async getScheduledRuns(start: Date, end: Date) {
    return new Promise((resolve, reject) => {
      this.scheduleService.getAllScheduledRuns(start, end).subscribe(
        (schedule) => {
          console.log('the scheduled runs in the DB::', schedule);
          this.scheduledRuns = schedule;

          resolve(this.scheduledRuns);
        },
        (err) => reject()
      );
    });
  }

  linkSchedule() {
    // Create a Map for faster lookups
    const runsMap = new Map<string, any>(); // Map<date, run>

    // Populate the Map with runs
    this.scheduledRuns.forEach((run) => {
      runsMap.set(moment(run.date).format('YYYY-MM-DD'), run);
    });

    // Iterate through the weeks and days
    this.weeksInMonth.forEach((week: CalendarDay[], weekIndex) => {
      week.forEach((day: CalendarDay, index: number) => {
        const run = runsMap.get(moment(day.date).format('YYYY-MM-DD'));
        if (run) {
          console.log(
            'Found a run that matches a date:',
            'date:',
            day.date,
            'with:',
            run
          );

          // Update the original day object within the array
          this.weeksInMonth[weekIndex][index] = {
            ...day,
            scheduledRun: run,
          };
        }
      });
    });

    // Do the same for the week view
    this.currentWeekDays.forEach((day, dayIndex) => {
      const run = runsMap.get(moment(day.date).format('YYYY-MM-DD'));
      if (run) {
        console.log(
          'Found a run that matches a date:',
          'date:',
          day.date,
          'with:',
          run
        );

        // Update the original day object within the array
        this.currentWeekDays[dayIndex].scheduledRun = run;
        console.log(
          'the day object now IN WEEK ARRAY::',
          this.currentWeekDays[dayIndex]
        );
      }
    });
  }

  generateSchedule(firstDayOfMonth?: Date, lastDayOfMonth?: Date) {
    console.log('passed in first day of month::', firstDayOfMonth);
    console.log('passed in last day of month::', lastDayOfMonth);
    this.weeksInMonth = [];

    if (!firstDayOfMonth) {
      console.log('in current month, setting first');
      firstDayOfMonth = new Date(
        this.selectedMonthYear.getFullYear(),
        this.selectedMonthYear.getMonth(),
        1
      );
    }

    if (!lastDayOfMonth) {
      console.log('in current month, setting last');
      lastDayOfMonth = new Date(
        this.selectedMonthYear.getFullYear(),
        this.selectedMonthYear.getMonth() + 1,
        0
      );
    }

    // Start with the first Monday on or before the first day of the month
    let startOfWeek = new Date(firstDayOfMonth);
    startOfWeek.setDate(
      firstDayOfMonth.getDate() - ((firstDayOfMonth.getDay() + 6) % 7)
    );

    while (startOfWeek <= lastDayOfMonth) {
      let daysInWeek = [];

      for (let i = 0; i < 7; i++) {
        if (startOfWeek <= lastDayOfMonth) {
          daysInWeek.push({ date: new Date(startOfWeek) });
          startOfWeek.setDate(startOfWeek.getDate() + 1);
        }
      }

      this.weeksInMonth.push([...daysInWeek]);
    }

    // Week view logic
    this.currentWeekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(this.startOfWeek);
      day.setDate(this.startOfWeek.getDate() + i);
      this.currentWeekDays.push({ date: day });
    }

    this.linkSchedule();
  }

  getStartOfWeek(date: Date): Date {
    const dayIndex = date.getDay();
    const difference = dayIndex - 1; // Assuming Monday is the start of the week

    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - difference);

    return startOfWeek;
  }

  async nextMonth() {
    // Increment the month by 1
    this.selectedMonthYear.setMonth(this.selectedMonthYear.getMonth() + 1);

    // Update UI variables
    this.monthOnUI = this.selectedMonthYear.getMonth() + 1;
    this.yearOnUI = this.selectedMonthYear.getFullYear();

    //get first and last days of selected month and regenerate schedule
    this.startOfCurrentMonth = new Date(
      this.selectedMonthYear.getFullYear(),
      this.selectedMonthYear.getMonth(),
      1
    );

    this.endOfCurrentMonth = new Date(
      this.selectedMonthYear.getFullYear(),
      this.selectedMonthYear.getMonth() + 1,
      0
    );

    await this.getScheduledRuns(
      this.startOfCurrentMonth,
      this.endOfCurrentMonth
    );
    this.generateSchedule(this.startOfCurrentMonth, this.endOfCurrentMonth);
    this.linkSchedule();
  }

  async previousMonth() {
    // Decrement the month by 1
    this.selectedMonthYear.setMonth(this.selectedMonthYear.getMonth() - 1);

    // Update UI variables
    this.monthOnUI = this.selectedMonthYear.getMonth() + 1;
    this.yearOnUI = this.selectedMonthYear.getFullYear();

    //get first and last days of selected month and regenerate schedule
    this.startOfCurrentMonth = new Date(
      this.selectedMonthYear.getFullYear(),
      this.selectedMonthYear.getMonth(),
      1
    );

    this.endOfCurrentMonth = new Date(
      this.selectedMonthYear.getFullYear(),
      this.selectedMonthYear.getMonth() + 1,
      0
    );

    await this.getScheduledRuns(
      this.startOfCurrentMonth,
      this.endOfCurrentMonth
    );
    this.generateSchedule(this.startOfCurrentMonth, this.endOfCurrentMonth);
    this.linkSchedule();
  }

  //switch between week and month view
  changeCalendarView() {
    this.monthView = !this.monthView;
  }

  isPreviousMonth(day: Date): boolean {
    const currentMonth = this.selectedMonthYear.getMonth();
    const dayMonth = day.getMonth();

    return dayMonth < currentMonth;
  }

  scheduleRun(day?: CalendarDay) {
    let scheduleRunDialogRef;
    if (
      day?.scheduledRun &&
      !day.scheduledRun.completed &&
      day.date <= this.currentDate
    ) {
      scheduleRunDialogRef = this.dialog.open(CompleteRunDialogComponent, {
        data: {
          date: day.date ? day.date : null,
          run: day.scheduledRun,
        },
        width: '350px',
        height: '200px',
        disableClose: true,
      });
    } else if (day?.scheduledRun) {
      //we already have a run scheduled for this day so we open the preview and allow to edit, delete etc.
      scheduleRunDialogRef = this.dialog.open(PreviewRunDialogComponent, {
        data: {
          date: day.date ? day.date : null,
          run: day.scheduledRun,
        },
        width: '500px',
        height: '30rem',
      });
    } else {
      scheduleRunDialogRef = this.dialog.open(AddRunDialogComponent, {
        data: {
          date: day?.date ? day.date : null,
        },
        width: '500px',
        height: '650px',
        disableClose: true,
      });
    }

    scheduleRunDialogRef?.afterClosed().subscribe(async () => {
      console.log('closed schedule dialog');
      await this.getScheduledRuns(
        this.startOfCurrentMonth,
        this.endOfCurrentMonth
      );
      this.generateSchedule(this.startOfCurrentMonth, this.endOfCurrentMonth);
    });
  }
}
