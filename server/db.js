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
  };
}

  viewallRunsInRange = async (start, end) => {
    console.log("START: ", start)
    console.log("END :", end)
    try {
        const result = await this.connection
        .request()
        .query(`select RunDate, Distance, Notes from dbo.RunLog where RunDate >= '${start}' and RunDate <= '${end}'`);
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
  }


  logRun = async (run) => {
    try {
        const result = await this.connection
        .request()
        .query(`Insert into dbo.RunLog values ('${run.date}', '${run.distance}', '${run.notes}');`);
        return result;
    } catch (err) {
        console.log(err);
    }
  }

}


module.exports = new Database();