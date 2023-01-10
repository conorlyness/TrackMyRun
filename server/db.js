var config = require('./config');
const sql = require('mssql');

class Database {
  constructor() {
    this.connection = null;
  }

  connect = async () => {
    try {
      this.connection = await sql.connect(config);
      console.log('Connected to database successfully');
    } catch (error) {
      console.log(error);
    }
  };

  viewAllRuns = async () => {
    try {
      const result = await this.connection
        .request()
        .query(`SELECT * FROM dbo.RunLog;`);
      return result.recordset;
    } catch (err) {
      console.log(err);
    }
  };

  viewallRunsInRange = async (start, end) => {
    console.log('START: ', start);
    console.log('END :', end);
    try {
      const result = await this.connection
        .request()
        .query(
          `select RunDate, Distance, Notes from dbo.RunLog where RunDate >= '${start}' and RunDate <= '${end}'`
        );
      return result.recordset;
    } catch (err) {
      console.log(err);
    }
  };

  logRun = async (run) => {
    try {
      const result = await this.connection
        .request()
        .query(
          `Insert into dbo.RunLog values ('${run.date}', '${run.distance}', '${run.notes}');`
        );
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  editRun = async (run) => {
    try {
      const result = await this.connection.request().query(`UPDATE dbo.RunLog
      SET Distance = '${run.distance}', Notes = '${run.notes}'
      WHERE RunDate = '${run.date}';`);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  sumOfRunsOnDaysOfWeek = async () => {
    try {
      const result = await this.connection.request().query(`SELECT
    CASE DATEPART(WEEKDAY, RunDate)
        WHEN 1 THEN 'Sunday'
        WHEN 2 THEN 'Monday'
        WHEN 3 THEN 'Tuesday'
        WHEN 4 THEN 'Wednesday'
        WHEN 5 THEN 'Thursday'
        WHEN 6 THEN 'Friday'
        WHEN 7 THEN 'Saturday'
    END as DayOfWeek,
    SUM(CAST(Distance AS decimal(5, 2))) as TotalMiles
    FROM
    dbo.RunLog
GROUP BY
    DATEPART(WEEKDAY, RunDate)
ORDER BY
    DayOfWeek;`);
      return result.recordset;
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = new Database();
