var config = require('./config');
const { Client } = require('pg');
const analyticsQueries = require('./sqlQueries/analytics');
const coreQueries = require('./sqlQueries/core');

class Database {
  constructor() {
    this.client = null;
  }

  connect = async () => {
    try {
      this.client = new Client({
        user: config.user,
        password: config.password,
        host: config.host,
        database: config.database,
        port: config.port,
        ssl: config.ssl,
      });
      await this.client.connect();
      console.log('Connected to database successfully.');
      //we keep pinging the db to ensure the connection is kept alive
      setInterval(() => {
        this.keepConnectionAlive();
      }, 30000);

      //we end the connection after 50 mins due to a 60 min hard limit
      //on connections to the db.
      setTimeout(() => {
        this.client.end((err) => {
          console.log('disconnected from db');
          if (err) {
            console.log('error disconnecting from db: ', err);
          }
        });
      }, 50 * 60 * 1000);

      //we listen for the end event and then reconnect
      this.client.on('end', async () => {
        console.log('Connection to db has ended. Reconnecting...');
        await this.connect();
      });

      //if there is an error emitted then we reconnect
      this.client.on('error', async () => {
        console.log('Error with the db. Reconnecting...');
        await this.connect();
      });
    } catch (err) {
      console.error('Error connecting to database:', err.stack);
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
        /({run.date})|({run.distance})|({run.notes})|({run.rpe})|({run.shoes})/g,
        function (match) {
          if (match === '{run.date}') return run.date;
          if (match === '{run.distance}') return run.distance;
          if (match === '{run.notes}') return run.notes;
          if (match === '{run.rpe}') return run.rpe;
          if (match === '{run.shoes}') return run.shoes;
        }
      );
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  editRun = async (run) => {
    try {
      let query = coreQueries.editRun.replace(
        /({run.date})|({run.distance})|({run.notes})|({run.rpe})|({run.id})|({run.shoe})/g,
        function (match) {
          if (match === '{run.date}') return run.date;
          if (match === '{run.distance}') return run.distance;
          if (match === '{run.notes}') return run.notes;
          if (match === '{run.rpe}') return run.rpe;
          if (match === '{run.id}') return run.id;
          if (match === '{run.shoe}') return run.shoe;
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
        /({run.date})|({run.distance})|({run.notes})|({run.rpe})|({run.shoe})/g,
        function (match) {
          if (match === '{run.date}') return run.date;
          if (match === '{run.distance}') return run.distance;
          if (match === '{run.notes}') return run.notes;
          if (match === '{run.rpe}') return run.rpe;
          if (match === '{run.shoe}') return run.shoe;
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

  keepConnectionAlive = async () => {
    try {
      // send a simple query to the database
      await this.client.query('SELECT 1');
      console.log('Keep-alive query sent');
    } catch (error) {
      console.error(`Error sending keep-alive query: ${error}`);
    }
  };

  getAllPersonalBests = async () => {
    try {
      const result = await this.client.query(coreQueries.viewAllPersonalBests);
      return result.rows;
    } catch (error) {
      console.log(error);
    }
  };

  editPersonalBest = async (run) => {
    try {
      let query = coreQueries.editPersonalBest.replace(
        /({time})|({distance})/g,
        function (match) {
          if (match === '{time}') return run.time;
          if (match === '{distance}') return run.distance;
        }
      );
      const result = await this.client.query(query);
      return result.rows;
    } catch (error) {
      console.log(error);
    }
  };

  getAllShoes = async () => {
    try {
      const result = await this.client.query(coreQueries.viewAllShoes);
      return result.rows;
    } catch (error) {
      console.log(error);
    }
  };

  addNewShoes = async (shoe) => {
    try {
      let query = coreQueries.addNewShoes.replace(
        /({shoe.brand})|({shoe.name})/g,
        function (match) {
          if (match === '{shoe.brand}') return shoe.brand;
          if (match === '{shoe.name}') return shoe.name;
        }
      );
      const result = await this.client.query(query);
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  increaseShoeDistance = async (shoe) => {
    try {
      let query = coreQueries.increaseShoeDistance.replace(
        /({shoe.distance})|({shoe.brand})|({shoe.name})/g,
        function (match) {
          if (match === '{shoe.distance}') return shoe.distance;
          if (match === '{shoe.brand}') return shoe.brand;
          if (match === '{shoe.name}') return shoe.name;
        }
      );
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  decreaseShoeDistance = async (shoe) => {
    try {
      let query = coreQueries.decreaseShoeDistance.replace(
        /({shoe.distance})|({shoe.brand})|({shoe.name})/g,
        function (match) {
          if (match === '{shoe.distance}') return shoe.distance;
          if (match === '{shoe.brand}') return shoe.brand;
          if (match === '{shoe.name}') return shoe.name;
        }
      );
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  reactivateShoe = async (shoe) => {
    try {
      let query = coreQueries.reactivateShoe.replace(
        /({shoe.brand})|({shoe.name})/g,
        function (match) {
          if (match === '{shoe.brand}') return shoe.brand;
          if (match === '{shoe.name}') return shoe.name;
        }
      );
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  retireShoe = async (shoe) => {
    try {
      let query = coreQueries.retireShoe.replace(
        /({shoe.brand})|({shoe.name})/g,
        function (match) {
          if (match === '{shoe.brand}') return shoe.brand;
          if (match === '{shoe.name}') return shoe.name;
        }
      );
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  deleteShoe = async (shoe) => {
    try {
      let query = coreQueries.deleteShoe.replace(
        /({shoe.brand})|({shoe.name})/g,
        function (match) {
          if (match === '{shoe.brand}') return shoe.brand;
          if (match === '{shoe.name}') return shoe.name;
        }
      );
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  addImage = async (img) => {
    try {
      let query = coreQueries.addImage.replace(
        /({img.url})|({img.description})|({img.tags})/g,
        function (match) {
          if (match === '{img.url}') return img.url;
          if (match === '{img.description}') return img.description;
          if (match === '{img.tags}') return img.tags;
        }
      );
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  getAllImages = async () => {
    try {
      let query = coreQueries.getAllImages;
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = new Database();
