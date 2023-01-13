export type Run = {
  Distance: string;
  Notes: String;
  RunDate: string;
};

export type DistanceByDay = {
  DayOfWeek: string;
  TotalMiles: number;
};

export type SixMonthTotals = {
  Month: string;
  TotalDistance: number;
};
