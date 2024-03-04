export type Run = {
  distance: string;
  notes: String;
  rundate: string;
  rpe: number;
  shoe: String;
  tags: string[];
};

export type DistanceByDay = {
  day_of_week: string;
  total_miles: number;
};

export type SixMonthTotals = {
  month: string;
  totaldistance: number;
};

export type CurrentMonthTotalRuns = {
  total_days_with_runs: number;
};

export type OverallTotal = {
  total_distance: number;
};

export type LongestDistance = {
  longest_run: number;
};

export type WeeklyTotal = {
  total_distance_week: number;
};

export type MonthAndYear = {
  month: number;
  year: number;
};

export type DailyAvgMonthAndYear = {
  average_daily_distance: number;
};

export type MonthlyTotalMonthAndYear = {
  total_distance: number;
};

export type EditDialogData = {
  date: string;
  distance: number;
  notes: string;
  rpe: number;
  id: number;
  shoe: string;
  tags: string[];
};

export type PersonalBest = {
  distance: string;
  time: any;
};

export type DistanceFilter = {
  min: number | undefined;
  max: number | undefined;
};

export type Range = {
  start: any;
  end: any;
};

export type Shoe = {
  brand: string;
  name: string;
  distance: number;
  active: boolean;
};

export type Image = {
  url: string;
  description: string;
  tags: string[];
};

export type ScheduledRun = {
  date: string;
  distance: number;
  notes: string;
  completed: boolean;
  race: boolean;
  incomplete: boolean;
};

export type CalendarDay = {
  date: Date;
  scheduledRun?: ScheduledRun;
};
