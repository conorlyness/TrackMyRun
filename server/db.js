let config = require('./config');
const winston = require('winston');
const { combine, timestamp, printf, colorize, align } = winston.format;
const path = require('path');
const { Client } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const analyticsQueries = require('./sqlQueries/analytics');
const { coreQueries, coreQueriesSqlite } = require('./sqlQueries/core');
let tmrDB;
const cloudDB = process.env.CLOUD_DB === 'true';
//uncomment when running server standalone and wishing to use cloud DB
// const cloudDB = true;

// WINSTON SETUP
// Path for our server logs, same location as electron logs
const logFilePath = path.join(
  process.env.APPDATA,
  'track-my-run',
  'logs',
  'server.log'
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({
      format: 'DD-MM-YYYY hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({
      filename: logFilePath,
    }),
    new winston.transports.Console(),
  ],
});

// Log file creation success
logger.info(`Server log file created at ${logFilePath}`);

// Log any error during file creation
logger.on('error', (err) => {
  console.error('Error occurred during log file creation:', err);
});
// END OF WINSTON SETUP
class Database {
  constructor() {
    if (cloudDB) {
      logger.info('Running in Cloud DB mode.');
      this.client = null;
    } else {
      logger.info('Running in Sqlite mode.');
      this.tmrDB = null;
    }
  }

  createDatabase = async () => {
    return new Promise((resolve, reject) => {
      this.tmrDB = new sqlite3.Database(
        path.join(__dirname, 'tmr.db'),
        (err) => {
          if (err) {
            logger.error(`Getting error::${err}`);
            reject(err);
          }
          this.createTables(this.tmrDB);
          resolve();
        }
      );
    });
  };

  createTables = (tmrDB) => {
    tmrDB.exec(coreQueriesSqlite.createTables);
  };

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
      logger.info('Connected to cloud database successfully.');
      if (process.send) process.send('Disconnected from DB');
      // if (process.send) process.send('Connection to DB successful');
      //we keep pinging the db to ensure the connection is kept alive
      setInterval(() => {
        this.keepConnectionAlive();
      }, 30000);

      //we end the connection after 50 mins due to a 60 min hard limit
      //on connections to the db.
      setTimeout(() => {
        this.client.end((err) => {
          logger.info('disconnected from db');
          if (err) {
            logger.error(`error disconnecting from db::${err}`);
            if (process.send) process.send('Disconnected from DB');
          }
        });
      }, 50 * 60 * 1000);

      //we listen for the end event and then reconnect
      this.client.on('end', async () => {
        logger.error('Connection to db has ended. Reconnecting...');
        await this.connect();
      });

      //if there is an error emitted then we reconnect
      this.client.on('error', async () => {
        logger.error('Error with the db. Reconnecting...');
        await this.connect();
      });
    } catch (err) {
      console.error('Error connecting to database:', err.stack);
    }
  };

  connectSqlite() {
    logger.info('connecting to sqlite db');
    this.tmrDB = new sqlite3.Database(
      path.join(__dirname, 'tmr.db'),
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          logger.error(err.message);
          if (process.send) process.send('DB Connection error');
        }
        logger.info('Connected to the TMR database.');
        if (process.send) process.send('Connection to DB successful');
      }
    );
  }

  viewAllRuns = async () => {
    try {
      let result;
      console.log('CLOUD DB FOR VIEW ALL RUNS???::', cloudDB);

      const query = cloudDB
        ? coreQueries.viewAllRuns
        : coreQueriesSqlite.viewAllRuns;

      if (cloudDB) {
        result = (await this.client.query(query)).rows;
      } else {
        result = await new Promise((resolve, reject) => {
          this.tmrDB.all(query, (err, rows) => {
            if (err) {
              logger.error(`Error executing query::${err.message}`);
              reject(err);
            } else {
              logger.log('Rows retrieved:', rows);
              resolve(rows);
            }
          });
        });
      }

      return result;
    } catch (err) {
      logger.error(err);
      return [];
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
      logger.error(err);
    }
  };

  logRun = async (run) => {
    try {
      let queryToReplace = cloudDB
        ? coreQueries.logRun
        : coreQueriesSqlite.logRun;
      let query = queryToReplace.replace(
        /({run.date})|({run.distance})|({run.notes})|({run.rpe})|({run.shoes})|({run.tags})/g,
        function (match) {
          if (match === '{run.date}') return run.date;
          if (match === '{run.distance}') return run.distance;
          if (match === '{run.notes}') return run.notes;
          if (match === '{run.rpe}') return run.rpe;
          if (match === '{run.shoes}') return run.shoes;
          if (match === '{run.tags}') return run.tags;
        }
      );

      let result;
      if (cloudDB) {
        result = await this.client.query(query);
      } else {
        result = await new Promise((resolve, reject) => {
          this.tmrDB.all(query, (err, rows) => {
            if (err) {
              logger.error(`Error executing query::${err.message}`);
              reject(err);
            } else {
              logger.info(`Rows retrieved::${rows}`);
              resolve(rows);
            }
          });
        });
      }
      return result;
    } catch (err) {
      logger.error(err);
    }
  };

  editRun = async (run) => {
    try {
      let query = coreQueries.editRun.replace(
        /({run.date})|({run.distance})|({run.notes})|({run.rpe})|({run.id})|({run.shoe})|({run.tags})/g,
        function (match) {
          if (match === '{run.date}') return run.date;
          if (match === '{run.distance}') return run.distance;
          if (match === '{run.notes}') return run.notes;
          if (match === '{run.rpe}') return run.rpe;
          if (match === '{run.id}') return run.id;
          if (match === '{run.shoe}') return run.shoe;
          if (match === '{run.tags}') return run.tags;
        }
      );
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      logger.error(err);
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
      logger.error(err);
    }
  };

  sumOfRunsOnDaysOfWeek = async () => {
    try {
      const result = await this.client.query(analyticsQueries.distanceByDay);
      return result.rows;
    } catch (err) {
      logger.error(err);
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
      logger.error(err);
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
      logger.error(err);
    }
  };

  totalDistanceRan = async () => {
    try {
      const result = await this.client.query(analyticsQueries.totalDistanceRan);
      return result.rows[0];
    } catch (err) {
      logger.error(err);
    }
  };

  longestRun = async () => {
    try {
      const result = await this.client.query(analyticsQueries.longestRun);
      return result.rows[0];
    } catch (err) {
      logger.error(err);
    }
  };

  totalDistanceThisCurrentWeek = async () => {
    try {
      const result = await this.client.query(
        analyticsQueries.totalDistanceSoFarThisWeek
      );
      return result.rows[0];
    } catch (err) {
      logger.error(err);
    }
  };

  totalDistanceLast6Months = async () => {
    try {
      const result = await this.client.query(
        analyticsQueries.totalDistanceLast6Months
      );
      return result.rows;
    } catch (err) {
      logger.error(err);
    }
  };

  totalDaysRanThisMonth = async () => {
    try {
      const result = await this.client.query(
        analyticsQueries.numberOfRunsThisMonth
      );
      return result.rows;
    } catch (err) {
      logger.error(err);
    }
  };

  keepConnectionAlive = async () => {
    try {
      // send a simple query to the database
      await this.client.query('SELECT 1');
      logger.info('Keep-alive query sent');
    } catch (error) {
      console.error(`Error sending keep-alive query: ${error}`);
    }
  };

  getAllPersonalBests = async () => {
    try {
      const result = await this.client.query(coreQueries.viewAllPersonalBests);
      return result.rows;
    } catch (error) {
      logger.info(error);
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
      logger.info(error);
    }
  };

  getAllShoes = async () => {
    try {
      let result;
      const query = cloudDB
        ? coreQueries.viewAllShoes
        : coreQueriesSqlite.viewAllShoes;
      console.log('SHOES QUERY::', query);
      if (cloudDB) {
        result = (await this.client.query(query)).rows;
      } else {
        result = await new Promise((resolve, reject) => {
          this.tmrDB.all(query, (err, rows) => {
            if (err) {
              console.error('Error executing query:', err.message);
              reject(err);
            } else {
              logger.info(`Rows retrieved::${rows}`);
              resolve(rows);
            }
          });
        });
      }
      return result;
    } catch (error) {
      logger.info(error);
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
      logger.info(result);
      return result;
    } catch (err) {
      logger.error(err);
    }
  };

  increaseShoeDistance = async (shoe) => {
    try {
      let result;
      let queryToReplace = cloudDB
        ? coreQueries.increaseShoeDistance
        : coreQueriesSqlite.increaseShoeDistance;
      let query = queryToReplace.replace(
        /({shoe.distance})|({shoe.brand})|({shoe.name})/g,
        function (match) {
          if (match === '{shoe.distance}') return shoe.distance;
          if (match === '{shoe.brand}') return shoe.brand;
          if (match === '{shoe.name}') return shoe.name;
        }
      );

      if (cloudDB) {
        result = await this.client.query(query);
      } else {
        result = await new Promise((resolve, reject) => {
          this.tmrDB.all(query, (err, rows) => {
            if (err) {
              console.error('Error executing query:', err.message);
              reject(err);
            } else {
              logger.info(`Rows retrieved::${rows}`);
              resolve(rows);
            }
          });
        });
      }
      return result;
    } catch (err) {
      logger.error(err);
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
      logger.error(err);
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
      logger.error(err);
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
      logger.error(err);
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
      logger.error(err);
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
      logger.error(err);
    }
  };

  getAllImages = async () => {
    try {
      let query = coreQueries.getAllImages;
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      logger.error(err);
    }
  };

  //run schedule functions
  getAllSchedule = async (dates) => {
    try {
      let query = coreQueries.getAllSchedule.replace(
        /({schedule.start})|({schedule.end})/g,
        function (match) {
          if (match === '{schedule.start}') return dates.start;
          if (match === '{schedule.end}') return dates.end;
        }
      );
      const result = await this.client.query(query);
      return result.rows;
    } catch (err) {
      logger.error(err);
    }
  };

  scheduleRun = async (run) => {
    try {
      let query = coreQueries.scheduleRun.replace(
        /({run.date})|({run.distance})|({run.notes})|({run.completed})|({run.race})|({run.incomplete})/g,
        function (match) {
          if (match === '{run.date}') return run.date;
          if (match === '{run.distance}') return run.distance;
          if (match === '{run.notes}') return run.notes;
          if (match === '{run.completed}') return run.completed;
          if (match === '{run.race}') return run.race;
          if (match === '{run.incomplete}') return run.incomplete;
        }
      );
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      logger.error(err);
    }
  };

  editSchedule = async (run) => {
    try {
      let query = coreQueries.editSchedule.replace(
        /({run.date})|({run.distance})|({run.notes})|({run.race})/g,
        function (match) {
          if (match === '{run.date}') return run.date;
          if (match === '{run.distance}') return run.distance;
          if (match === '{run.notes}') return run.notes;
          if (match === '{run.race}') return run.race;
        }
      );
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      logger.error(err);
    }
  };

  completeRun = async (run) => {
    try {
      let query = coreQueries.markScheduleAsComplete.replace(
        /({run.date})/g,
        function (match) {
          if (match === '{run.date}') return run.date;
        }
      );
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      logger.error(err);
    }
  };

  markRunIncomplete = async (run) => {
    try {
      let query = coreQueries.markScheduleAsIncomplete.replace(
        /({run.date})/g,
        function (match) {
          if (match === '{run.date}') return run.date;
        }
      );
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      logger.error(err);
    }
  };

  deleteSchedule = async (run) => {
    try {
      let query = coreQueries.deleteSchedule.replace(
        /({run.date})|({run.distance})/g,
        function (match) {
          if (match === '{run.date}') return run.date;
          if (match === '{run.distance}') return run.distance;
        }
      );
      const result = await this.client.query(query);
      return result;
    } catch (err) {
      logger.error(err);
    }
  };

  getRaceDays = async () => {
    try {
      let query = coreQueries.getAllRaces;
      const result = await this.client.query(query);
      return result.rows;
    } catch (err) {
      logger.error(err);
    }
  };
}

module.exports = new Database();
