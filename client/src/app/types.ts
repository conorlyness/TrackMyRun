export type Run = {
  Distance: string;
  Notes: String;
  RunDate: string;
  RPE: number;
};

export type DistanceByDay = {
  day_of_week: string;
  total_miles: number;
};

export type SixMonthTotals = {
  month: string;
  totaldistance: number;
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
  average_daily_distance_month_year: number;
};

export type MonthlyTotalMonthAndYear = {
  total_distance: number;
};
