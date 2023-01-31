require('dotenv').config();

const config = {
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  host: 'db.bit.io',
  database: '<ENTER YOUR DB NAME HERE>',
  port: 5432,
  ssl: true,
  keepAlive: true,
};

module.exports = config;
