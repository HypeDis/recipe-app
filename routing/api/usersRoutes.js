// const express = require('express');
const bcrypt = require('bcryptjs');
const Router = require('express-promise-router');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const secretOrKey = require('./../../config/keys').secretOrKey;

const router = new Router();

const db = require('../../dB/postgresPool');

const queries = require('./../../dB/postgresQueries');

const registerInputValidation = require('./../../validation/registerInputValidation');
const loginInputValidation = require('./../../validation/loginInputValidation');

// @route: GET to /api/users/
// @desc: get all users
// @access: public

router.get('/', (req, res) => {
  db.query(queries.selectAllUsers, (err, result) => {
    if (err) {
      return res.status(400).json(err);
    }
    res.status(200).json(result.rows);
  });
});

// @route: GET to /api/users/:user_id
// @desc: get a user by id
// @access: public

router.get('/userid/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  //validate user_id
  db.query(queries.selectUserById, [user_id], (err, result) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.status(200).json(result.rows);
  });
});

// router.get('/:user_id', async (req, res) => {
//   const user_id = parseInt(req.params.user_id);
//   //validate user_id
//   try {
//     const user = await db.query(queries.selectUserById, [user_id]);
//     res.status(200).json(result.rows);
//   } catch (err) {
//     res.status(400).json({ err });
//   }
// });

// @route: POST to /api/users/register
// @desc: register a user
// @access: public

router.post('/register', async (req, res) => {
  // validate inputs
  let { errors, isValid } = registerInputValidation(req.body);

  if (!isValid) {
    console.log('register input failure');
    return res.status(400).json({ errors });
  }

  const data = req.body;

  // unique email validation
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [
      data.email,
    ]);
    if (rows.length > 0) {
      errors.email = 'Email already exists';
      isValid = false;
    }
  } catch (err) {
    return res.status(400).json(err);
  }
  // unique username validation
  try {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE user_name = $1',
      [data.user_name]
    );
    if (rows.length > 0) {
      errors.userName = 'User name already exists';
      isValid = false;
    }
  } catch (err) {
    return res.status(400).json(err);
  }

  if (isValid === false) {
    return res.status(400).json({ errors });
  }

  //hash password if no errors
  data.password = await bcrypt
    .hash(data.password, await bcrypt.genSalt())
    .catch(err => {
      if (err) {
        console.log(err);
      }
    });

  // prepare data for postgres query
  const created_at = new Date();
  let dataArr = [
    data.user_name,
    data.email,
    data.name,
    data.password,
    created_at,
  ];

  db.query(queries.insertNewUser, dataArr, (err, result) => {
    console.log('creating user');
    if (err) {
      res.status(400).json(err);
    }
    db.query(
      'SELECT * FROM users WHERE user_name = $1',
      [data.user_name],
      (err, result) => {
        if (err) {
          return res.status(400).json({ err });
        }
        res.status(200).json(result.rows);
      }
    );
  });
});

// @route: GET to /api/users/login
// @desc: log in to account / return jwt token
// @access: private

router.post('/login', async (req, res) => {
  let { errors, isValid } = loginInputValidation(req.body);
  if (!isValid) {
    res.status(400).json({ errors });
  }

  const email = req.body.email;
  const password = req.body.password;

  //check if email exists
  try {
    const { rows } = await db.query(queries.selectUserByEmail, [email]);
    const user = rows[0];
    if (user.length === 0) {
      errors.email = 'User not found';
      return res.status(400).json({ errors });
    }

    //check if password matches
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        errors.password = 'Email and password do not match';
        return res.status(400).send({ errors });
      }
      //create jwt payload
      console.log(typeof user.user_id);
      const payload = {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
      };
      console.log(payload);

      //sign the payload
      jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
        if (err) {
          console.log(err);
        }
        res.status(200).json({
          success: true,
          token,
        });
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log('err');
    return res.status(400).json(err);
  }
});

// @route: GET to /api/users/current
// @desc: access user info using jwt auth token
// @access: private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({
      id: req.user.user_id,
      user_name: req.user.user_name,
      email: req.user.email,
    });
  }
);

module.exports = router;
