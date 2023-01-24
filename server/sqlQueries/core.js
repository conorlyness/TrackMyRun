let coreQueries = {
  viewAllRuns: `SELECT * FROM dbo.RunLog ORDER BY RunDate DESC;`,
  viewAllRunsInRange: `select RunDate, Distance, Notes from dbo.RunLog where RunDate >= '{start}' and RunDate <= '{end}'`,
  logRun: `Insert into dbo.RunLog values ('{run.date}', '{run.distance}', '{run.notes}');`,
  editRun: `UPDATE dbo.RunLog SET Distance = '{run.distance}', Notes = '{run.notes}' WHERE RunDate = '{run.date}';`,
};

module.exports = coreQueries;
