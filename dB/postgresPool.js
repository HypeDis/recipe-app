const { Client } = require('pg');
const Pool = require('pg').Pool;

const { elephantURI } = require('../config/keys');

const pool = new Pool({
  connectionString: elephantURI,
});

module.exports = pool;
