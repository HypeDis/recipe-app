const { Client } = require('pg');
const Pool = require('pg').Pool;

const { elephantURI } = require('./../config/postgresConfig');
// const config = ({
//   port,
//   user,
//   host,
//   database,
//   password,
// } = require('./../config/postgresConfig'));

const pool = new Pool({
  connectionString: elephantURI,
});

const getUsers = (req, res) => {
  pool.query('SELECT * FROM users ORDER BY user_id ASC', (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json(results.rows);
  });
};

const getUserByID = (req, res) => {
  //   const id = parseInt(req.params.id);
  const id = req.params.id;
  console.log(id);
  pool.query('SELECT * FROM users WHERE user_id = $1', [id], (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json(results.rows);
  });
};

const createUser = (req, res) => {
  const { name, email } = req.body;
  pool.query(
    'INSERT INTO users (name, email) VALUES ($1 ,$2)',
    [name, email],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.dir(results, { showHidden: true });
      res.status(201).send(`User created with id ${results.insertId}`);
    }
  );
};

const updateUser = (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE user_id = $3',
    [name, email, id],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM users WHERE user_id = $1', [id], (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).send(`User deleted with id: ${id}`);
  });
};

module.exports = {
  getUserByID,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
};
