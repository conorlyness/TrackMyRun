var config = require('./config');
const { Client } = require('pg');
const analyticsQueries = require('./sqlQueries/analytics');
const coreQueries = require('./sqlQueries/core');

class Database {
  constructor() {
    this.clent = null;
  }

  connect = async () => {
    this.client = new Client({
      user: config.user,
      password: config.password,
      host: config.host,
      database: config.database,
      port: config.port,
      ssl: config.ssl,
      keepAlive: config.keepAlive,
    });

    try {
      await this.client.connect();
      console.log('Connected to Bit.io database successfully.');
    } catch (err) {
      console.error('Error connecting to Bit.io database:', err.stack);
    }
  };

  viewAllRuns = async () => {
    try {
      const result = await this.client.query(coreQueries.viewAllRuns);
      return result.rows;
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
      const result = await this.client.query(query);
      return result.rows;
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
      const result = await this.client.query(query);
      console.log(result);
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
      const result = await this.client.query(query);
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
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  sumOfRunsOnDaysOfWeek = async () => {
    try {
      const result = await this.client.query(analyticsQueries.distanceByDay);
      return result.rows;
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
      const result = await this.client.query(query);
      console.log(result.rows[0]);
      return result.rows[0];
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
      const result = await this.client.query(query);
      console.log(result.rows[0]);
      return result.rows[0];
    } catch (err) {
      console.log(err);
    }
  };

  totalDistanceRan = async () => {
    try {
      const result = await this.client.query(analyticsQueries.totalDistanceRan);
      return result.rows[0];
    } catch (err) {
      console.log(err);
    }
  };

  longestRun = async () => {
    try {
      const result = await this.client.query(analyticsQueries.longestRun);
      return result.rows[0];
    } catch (err) {
      console.log(err);
    }
  };

  totalDistanceThisCurrentWeek = async () => {
    try {
      const result = await this.client.query(
        analyticsQueries.totalDistanceSoFarThisWeek
      );
      console.log(result.rows[0]);
      return result.rows[0];
    } catch (err) {
      console.log(err);
    }
  };

  totalDistanceLast6Months = async () => {
    try {
      const result = await this.client.query(
        analyticsQueries.TotalDistanceLast6Months
      );
      return result.rows;
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = new Database();
