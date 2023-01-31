let coreQueries = {
  viewAllRuns: `SELECT * FROM "RunLog" ORDER BY "RunDate" DESC;`,
  viewAllRunsInRange: `select "RunDate", "Distance", "Notes", "RPE" from "RunLog" where "RunDate" >= '{start}' and "RunDate" <= '{end}';`,
  logRun: `Insert into "RunLog" values ('{run.date}', '{run.distance}', '{run.notes}', '{run.rpe}');`,
  editRun: `UPDATE "RunLog" SET "Distance" = '{run.distance}', "Notes" = '{run.notes}', "RPE" = '{run.rpe}' WHERE "RunDate" = '{run.date}';`,
  deleteRun: `DELETE FROM "RunLog" WHERE "RunDate" = '{run.date}' AND "Distance" = '{run.distance}' AND "Notes" = '{run.notes}';`,
};

module.exports = coreQueries;
