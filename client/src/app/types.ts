export type Run = {
  Distance: string;
  Notes: String;
  RunDate: string;
  RPE: number;
};

export type DistanceByDay = {
  DayOfWeek: string;
  TotalMiles: number;
};

export type SixMonthTotals = {
  Month: string;
  TotalDistance: number;
};

export type OverallTotal = {
  TotalDistance: number;
};

export type LongestDistance = {
  LongestRun: number;
};

export type WeeklyTotal = {
  TotalDistanceWeek: number;
};

export type MonthAndYear = {
  month: number;
  year: number;
};

export type DailyAvgMonthAndYear = {
  AverageDistancePerMonth: number;
};

export type MonthlyTotalMonthAndYear = {
  TotalDistance: number;
};
