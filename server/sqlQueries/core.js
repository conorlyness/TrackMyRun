let coreQueries = {
  viewAllRuns: `SELECT * FROM dbo.RunLog ORDER BY RunDate DESC;`,
  viewAllRunsInRange: `select RunDate, Distance, Notes from dbo.RunLog where RunDate >= '{start}' and RunDate <= '{end}'`,
  logRun: `Insert into dbo.RunLog values ('{run.date}', '{run.distance}', '{run.notes}', '{run.rpe}');`,
  editRun: `UPDATE dbo.RunLog SET Distance = '{run.distance}', Notes = '{run.notes}', RPE = '{run.rpe}' WHERE RunDate = '{run.date}';`,
  deleteRun: `DELETE FROM dbo.RunLog WHERE RunDate = '{run.date}' AND Distance = '{run.distance}' AND Notes = '{run.notes}';`,
};

module.exports = coreQueries;
