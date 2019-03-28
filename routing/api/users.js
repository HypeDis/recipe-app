const express = require('express');
const router = express.Router();

const db = require('../../dB/postgresPool');

/**
 * @Route GET to /users
 * @Descr Get all users
 * @Access Test
 */

const getUsers = (req, res) => {
  db.query('SELECT * FROM users ORDER BY user_id ASC', (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json(results.rows);
  });
};

router.get('/', getUsers);
/**
 * @Route GET to /users/:id
 * @Descr Get a specific user
 * @Access Private
 */

const getUserByID = (req, res) => {
  //   const id = parseInt(req.params.id);
  const user_id = req.params.user_id;
  console.log(user_id);
  db.query(
    'SELECT * FROM users WHERE user_id = $1',
    [user_id],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).json(result.rows);
    }
  );
};

router.get('/:user_id', getUserByID);
/**
 * @Route POST to /users/
 * @Descr Create a new user
 * @Access Public
 */

const createUser = (req, res) => {
  const { user_name, name, email, password } = req.body;
  /**
   * @TODO
   * run validation on all the inputs
   * hash pw with bcrypt
   */
  const created_at = new Date();

  db.query(
    'INSERT INTO users (user_name, name, email, password, created_at) VALUES ($1 ,$2, $3, $4, $5)',
    [user_name, name, email, password, created_at],
    (err, result) => {
      if (err) {
        throw err;
      }
      db.query(
        'SELECT * FROM users WHERE user_name = $1',
        [user_name],
        (err, result) => {
          if (err) {
            throw err;
          }
          res.status(200).json(result.rows);
        }
      );
      //   res.status(201).send(`New user created`);
    }
  );
};

router.post('/', createUser);

/**
 * @Route PUT to /users/:id
 * @Descr Update user information
 * @Access Private
 */

const updateUser = (req, res) => {
  /**
   * @TODO
   * add user authentication
   * create a dynamic query based on which fields are being updated
   */
  const user_id = req.params.user_id;
  const { user_name, name, email, password } = req.body;

  db.query(
    'UPDATE users SET name = $1, email = $2 WHERE user_id = $3',
    [name, email, user_id],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).send(`User modified with ID: ${user_id}`);
    }
  );
};
router.put('/:user_id', updateUser);
/**
 * @Route DELETE to /users/:id
 * @Descr Delete a user
 * @Access Private
 */

const deleteUser = (req, res) => {
  /**
   * @todo
   * add user authentication
   */
  const user_id = req.params.user_id;
  db.query(
    'DELETE FROM users WHERE user_id = $1',
    [user_id],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(200).send(`User deleted with id: ${user_id}`);
    }
  );
};
router.delete('/:user_id', deleteUser);

module.exports = router;
