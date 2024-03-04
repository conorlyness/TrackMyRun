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
  totalDaysRanThisMonth: 'http://localhost:3001/daysRanCurrentMonth',
  imageUploadUrl: 'http://localhost:3001/api/upload',
  addImgToDbUrl: 'http://localhost:3001/addImageToDb',
  getAllShoesUrl: 'http://localhost:3001/allShoes',
  addNewShoesUrl: 'http://localhost:3001/addShoe',
  increaseShoeMileageUrl: 'http://localhost:3001/increaseShoeDistance',
  decreaseShoeMileageUrl: 'http://localhost:3001/decreaseShoeDistance',
  retireShoeUrl: 'http://localhost:3001/retire',
  reactivateShoeUrl: 'http://localhost:3001/reactivate',
  deleteShoeUrl: 'http://localhost:3001/deleteShoe',
  runScheduleUrl: 'http://localhost:3001/runSchedule',
  addScheduleUrl: 'http://localhost:3001/addSchedule',
  editScheduleUrl: 'http://localhost:3001/editSchedule',
  deleteScheduleUrl: 'http://localhost:3001/deleteSchedule',
  completeRunUrl: 'http://localhost:3001/markAsComplete',
  incompleteRunUrl: 'http://localhost:3001/markAsIncomplete',
  raceDaysUrl: 'http://localhost:3001/raceDays',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
