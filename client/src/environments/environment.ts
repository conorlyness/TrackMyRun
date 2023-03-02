// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  getAllRunsUrl: 'http://localhost:3001/allRuns',
  getAllPbsUrl: 'http://localhost:3001/allPbs',
  editPbUrl: 'http://localhost:3001/editPb',
  getSpecificRunsUrl: 'http://localhost:3001/specificRuns',
  logNewRunUrl: 'http://localhost:3001/logRun',
  editRunUrl: 'http://localhost:3001/editRun',
  deleteRunUrl: 'http://localhost:3001/deleteRun',
  getDaysOfWeekDistanceUrl: 'http://localhost:3001/dayOfWeekDistance',
  getTotalMilesForMonthInYear: 'http://localhost:3001/totalForMonthYear',
  averageDistancePerDayMonthYear: 'http://localhost:3001/dailyAvgForMonthYear',
  totalDistanceRan: 'http://localhost:3001/totalDistance',
  longestRun: 'http://localhost:3001/longestRun',
  currentWeekTotal: 'http://localhost:3001/currentWeekTotal',
  totalLast6Months: 'http://localhost:3001/last6MonthsTotal',
  imageUploadUrl: 'http://localhost:3001/api/upload',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
