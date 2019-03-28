const db = require('../dB/postgresPool');
const usersTable = require('./usersTable');
const recipesTable = require('./recipesTable');

db.query(usersTable, (err, results) => {
  if (err) {
    throw err;
  }
  console.log('users table created');
});

db.query(recipesTable, (err, results) => {
  if (err) {
    throw err;
  }
  console.log('recipes table created');
});
