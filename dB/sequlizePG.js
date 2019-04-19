const Sequelize = require('sequelize');
// const { elephantURI } = require('./../config/keys');

// const pg = new Sequelize(elephantURI, { dialect: 'postgres' });

// (dbname, username, password)
const db = new Sequelize('recipe-app', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});

module.exports = db;
