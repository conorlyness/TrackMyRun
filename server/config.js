require('dotenv').config();

const config = {
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  host: process.env['DB_HOST'],
  database: 'trackMyRun',
  port: 5432,
  ssl: true,
};

module.exports = config;
