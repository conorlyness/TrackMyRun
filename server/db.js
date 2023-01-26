var config = require('./config');
const sql = require('mssql');
const analyticsQueries = require('./sqlQueries/analytics');
const coreQueries = require('./sqlQueries/core');

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
        .query(coreQueries.viewAllRuns);
      return result.recordset;
    } catch (err) {
      console.log(err);
    }
  };

  viewallRunsInRange = async (start, end) => {
    let query = coreQueries.viewAllRunsInRange.replace(
      /({start})|({end})/g,
      function (match) {
        if (match === '{start}') return start;
        if (match === '{end}') return end;
      }
    );
    try {
      const result = await this.connection.request().query(query);
      return result.recordset;
    } catch (err) {
      console.log(err);
    }
  };

  logRun = async (run) => {
    try {
      let query = coreQueries.logRun.replace(
        /({run.date})|({run.distance})|({run.notes})|({run.rpe})/g,
        function (match) {
          if (match === '{run.date}') return run.date;
          if (match === '{run.distance}') return run.distance;
          if (match === '{run.notes}') return run.notes;
          if (match === '{run.rpe}') return run.rpe;
        }
      );
      const result = await this.connection.request().query(query);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  editRun = async (run) => {
    try {
      let query = coreQueries.editRun.replace(
        /({run.date})|({run.distance})|({run.notes})|({run.rpe})/g,
        function (match) {
          if (match === '{run.date}') return run.date;
          if (match === '{run.distance}') return run.distance;
          if (match === '{run.notes}') return run.notes;
          if (match === '{run.rpe}') return run.rpe;
        }
      );
      const result = await this.connection.request().query(query);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  deleteRun = async (run) => {
    try {
      let query = coreQueries.deleteRun.replace(
        /({run.date})|({run.distance})|({run.notes})/g,
        function (match) {
          if (match === '{run.date}') return run.date;
          if (match === '{run.distance}') return run.distance;
          if (match === '{run.notes}') return run.notes;
        }
      );
      const result = await this.connection.request().query(query);
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
