import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
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
import { RunningDataService } from 'src/app/services/running-data.service';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { ElectronService } from 'src/app/services/electron.service';
import { AnalyticsService } from 'src/app/services/analytics.service';

export type PreviewData = {
  date: Date;
  run: ScheduledRun;
  completed?: boolean;
  incomplete?: boolean;
};

@Component({
  selector: 'app-run-schedule',
  templateUrl: './run-schedule.component.html',
  styleUrls: ['./run-schedule.component.scss'],
})
export class RunScheduleComponent implements OnInit {
  dayNames: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  monthView!: boolean;
  currentDate: Date = new Date();
  //we +1 to month as its 0 based
  currentMonthFixed: number = new Date().getMonth() + 1;
  startOfWeek: Date = this.getStartOfWeek(this.currentDate);
  selectedMonthYear: Date = new Date();
  monthOnUI: number = this.selectedMonthYear.getMonth() + 1;
  yearOnUI: number = this.selectedMonthYear.getFullYear();
  weeksInMonth: CalendarDay[][] = [];
  currentWeekDays: CalendarDay[] = [];
  scheduledRuns: ScheduledRun[] = [];
  daysScheduledThisMonth: number = 0;
  weeksLoggedMileage: number = 0;
  weeksScheduledMileage: number = 0;
  mileageCompletePercentage: number = 0;
  weeksLongRunDistance: number = 0;
  weeksLongRunDistanceDay: string = '';
  monthsTotalMiles: number = 0;
  nextRaceDate?: any;
  daysTillRace?: number;

  //mileage Gague values
  gaugeType: NgxGaugeType = 'arch';
  gaugeValue!: number;
  gaugeLabel: string = '';
  gaugeAppendText: string = '%';

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
    private scheduleService: ScheduleService,
    private runningDataService: RunningDataService,
    private electronService: ElectronService,
    private analyticsService: AnalyticsService
  ) {}

  async ngOnInit(): Promise<void> {
    //ensure we use same state as last time for showing week/month view
    if (typeof process !== 'undefined' && process.versions.electron) {
      this.electronService
        .onOnce('getScheduleSettings')
        .then((scheduleViewSetting: string) => {
          let viewPref = scheduleViewSetting[1];
          if (viewPref === 'true') this.monthView = true;
          if (viewPref === 'false') this.monthView = false;
        })
        .catch((error: any) => {
          console.error('Error receiving schedule settings:', error);
        });

      this.electronService.send('getScheduleSettings');
    } else {
      let localStorageView = localStorage.getItem('scheduleMonthView');
      if (localStorageView === 'false') this.monthView = false;
      if (localStorageView === 'true') this.monthView = true;
      if (!localStorageView) this.monthView = true;
    }

    this.getRaces();
    await this.getScheduledRuns(
      this.startOfCurrentMonth,
      this.endOfCurrentMonth
    );
    this.generateSchedule();
    await this.calculateWeeklyMileageGoal();
  }

  async getScheduledRuns(start: Date, end: Date) {
    //scenarios where start of week may be the last day or so in prev month/same for end of month
    let scheduleStart = start;
    let scheduleEnd = end;
    let endOfCurrentWeek = new Date(this.startOfWeek);
    endOfCurrentWeek.setDate(endOfCurrentWeek.getDate() + 6);
    if (scheduleStart > this.startOfWeek) scheduleStart = this.startOfWeek;
    if (scheduleEnd < endOfCurrentWeek) scheduleEnd = endOfCurrentWeek;

    return new Promise((resolve, reject) => {
      this.scheduleService
        .getAllScheduledRuns(scheduleStart, scheduleEnd)
        .subscribe(
          (schedule) => {
            this.scheduledRuns = schedule;

            resolve(this.scheduledRuns);
          },
          (err) => reject()
        );
    });
  }

  linkSchedule() {
    this.daysScheduledThisMonth = 0;
    this.weeksLongRunDistance = 0;
    this.monthsTotalMiles = 0;
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
          //update our monthly stats
          if (
            day.date >= this.startOfCurrentMonth &&
            day.date <= this.endOfCurrentMonth
          ) {
            this.daysScheduledThisMonth++;
            this.monthsTotalMiles += +run?.distance;
          }

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
        // Update the original day object within the array
        this.currentWeekDays[dayIndex].scheduledRun = run;

        if (this.currentWeekDays[dayIndex]?.scheduledRun?.distance) {
          let distance = this.currentWeekDays[dayIndex]?.scheduledRun
            ?.distance as number;
          let day = this.currentWeekDays[dayIndex]?.scheduledRun?.date;

          if (distance > this.weeksLongRunDistance) {
            this.weeksLongRunDistance = distance;
            this.weeksLongRunDistanceDay = day as string;
          }
        }
      }
    });
  }

  generateSchedule(firstDayOfMonth?: Date, lastDayOfMonth?: Date) {
    this.weeksInMonth = [];

    if (!firstDayOfMonth) {
      firstDayOfMonth = new Date(
        this.selectedMonthYear.getFullYear(),
        this.selectedMonthYear.getMonth(),
        1
      );
    }

    if (!lastDayOfMonth) {
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
    const difference = (dayIndex + 6) % 7; // Ensure the result is a positive number

    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - difference);

    return startOfWeek;
  }

  //the purpose of this is so that if the monday of the current week is in the previous month
  getStartOfWeekMonth(): number {
    return this.currentWeekDays[0]?.date.getMonth() + 1;
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
    if (this.monthView) {
      localStorage.setItem('scheduleMonthView', 'true');
      this.electronService.send('setScheduleMonthView', 'true');
    } else {
      localStorage.setItem('scheduleMonthView', 'false');
      this.electronService.send('setScheduleMonthView', 'false');
    }
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
      day.date <= this.currentDate &&
      !day.scheduledRun.incomplete
    ) {
      scheduleRunDialogRef = this.dialog.open(CompleteRunDialogComponent, {
        data: {
          date: day.date ? day.date : null,
          run: day.scheduledRun,
        },
        width: '450px',
        height: '350px',
        disableClose: true,
        autoFocus: false,
      });
    } else if (day?.scheduledRun) {
      let dialogData: PreviewData = {
        date: day.date,
        run: day.scheduledRun,
        completed: day.scheduledRun.completed,
        incomplete: day.scheduledRun.incomplete,
      };
      let height;
      let width;
      if (!day.scheduledRun.incomplete && !day.scheduledRun.completed) {
        width = '500px';
        height = '30rem';
      } else if (day.scheduledRun.completed) {
        width = '500px';
        height = '20rem';
      } else {
        width = '650px';
        height = '15rem';
      }

      //we already have a run scheduled for this day so we open the preview and allow to edit, delete etc.
      scheduleRunDialogRef = this.dialog.open(PreviewRunDialogComponent, {
        data: dialogData,
        width: width,
        height: height,
        autoFocus: false,
      });
    } else {
      scheduleRunDialogRef = this.dialog.open(AddRunDialogComponent, {
        data: {
          date: day?.date ? day.date : null,
        },
        width: '500px',
        height: '650px',
        disableClose: true,
        autoFocus: false,
      });
    }

    scheduleRunDialogRef?.afterClosed().subscribe(async () => {
      await this.getScheduledRuns(
        this.startOfCurrentMonth,
        this.endOfCurrentMonth
      );
      this.generateSchedule(this.startOfCurrentMonth, this.endOfCurrentMonth);
      this.calculateWeeklyMileageGoal();
      this.getRaces();
    });
  }

  async getWeeksLoggedMileage() {
    this.weeksLoggedMileage = 0;

    return new Promise((resolve, reject) => {
      this.analyticsService.getCurrentWeekTotal().subscribe(
        (val) => {
          this.weeksLoggedMileage = val.total_distance_week
            ? val.total_distance_week
            : 0;
          resolve(this.weeksLoggedMileage);
        },
        (err) => reject()
      );
    });
  }

  async getWeeksScheduledMileage() {
    this.weeksScheduledMileage = 0;
    return new Promise((resolve, reject) => {
      if (!this.currentWeekDays) reject();
      this.currentWeekDays.forEach((day) => {
        if (day.scheduledRun) {
          this.weeksScheduledMileage += +day.scheduledRun.distance;
        }
      });
      resolve(this.weeksScheduledMileage);
    });
  }

  async calculateWeeklyMileageGoal() {
    await this.getWeeksLoggedMileage();
    await this.getWeeksScheduledMileage();
    // Calculate the percentage complete
    if (this.weeksScheduledMileage <= 0) {
      this.mileageCompletePercentage = 100;
    } else {
      this.mileageCompletePercentage =
        (+this.weeksLoggedMileage / this.weeksScheduledMileage) * 100;
    }
    this.gaugeValue = +this.mileageCompletePercentage.toFixed(1);
    this.gaugeLabel = `${this.weeksLoggedMileage}/${this.weeksScheduledMileage} Miles`;
  }

  getRaces() {
    // fetch all data needed for schedule
    this.scheduleService.getRaceDays().subscribe((races) => {
      if (races) {
        for (const race of races) {
          const raceDate = new Date(race.date);
          const momentDate = moment(raceDate).format('YYYY-MM-DD');
          const currentDate = moment().format('YYYY-MM-DD');

          if (momentDate >= currentDate) {
            this.nextRaceDate = raceDate;
            const timeTillRace =
              raceDate.getTime() - this.currentDate.getTime();
            this.daysTillRace = Math.ceil(timeTillRace / (1000 * 60 * 60 * 24));
            return; // exit the loop early
          }
        }
      }
    });
  }
}
