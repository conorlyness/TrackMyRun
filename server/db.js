var config = require('./config');
const sql = require('mssql');
const analyticsQueries = require('./sqlQueries/analytics');

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
      const result = await this.connection
        .request()
        .query(analyticsQueries.distanceByDay);
      return result.recordset;
    } catch (err) {
      console.log(err);
    }
  };

  totalDistanceByMonthAndYear = async (month, year) => {
    try {
      let query = analyticsQueries.totalDistanceMonthYear.replace(
        /({month})|({year})/g,
        function (match) {
          if (match === '{month}') return month;
          if (match === '{year}') return year;
        }
      );
      const result = await this.connection.request().query(query);
      return result.recordset[0];
    } catch (err) {
      console.log(err);
    }
  };

  averageDistancePerDayInMonthAndYear = async (month, year) => {
    try {
      let query = analyticsQueries.averageDistancePerDayMonthYear.replace(
        /({month})|({year})/g,
        function (match) {
          if (match === '{month}') return month;
          if (match === '{year}') return year;
        }
      );
      const result = await this.connection.request().query(query);
      return result.recordset[0];
    } catch (err) {
      console.log(err);
    }
  };

  totalDistanceRan = async () => {
    try {
      const result = await this.connection
        .request()
        .query(analyticsQueries.totalDistanceRan);
      return result.recordset[0];
    } catch (err) {
      console.log(err);
    }
  };

  longestRun = async () => {
    try {
      const result = await this.connection
        .request()
        .query(analyticsQueries.longestRun);
      return result.recordset[0];
    } catch (err) {
      console.log(err);
    }
  };

  totalDistanceThisCurrentWeek = async () => {
    try {
      const result = await this.connection
        .request()
        .query(analyticsQueries.totalDistanceSoFarThisWeek);
      return result.recordset[0];
    } catch (err) {
      console.log(err);
    }
  };

  totalDistanceLast6Months = async () => {
    try {
      const result = await this.connection
        .request()
        .query(analyticsQueries.TotalDistanceLast6Months);
      return result.recordset;
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = new Database();
