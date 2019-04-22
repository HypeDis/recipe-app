const bcrypt = require('bcryptjs');
const Router = require('express-promise-router');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const secretOrKey = require('./../../config/keys').secretOrKey;
const isEmpty = require('./../../validation/is-empty');
const router = new Router();

// validation
const registerInputValidation = require('./../../validation/registerInputValidation');
const loginInputValidation = require('./../../validation/loginInputValidation');
const updateUserValidation = require('./../../validation/updateUserValidation');

const db = require('./../../dB/sequlizePG');
const Op = require('sequelize').Op;
const User = require('./../../dB/models/UsersModel');
User.sync();

/**
 * @Route GET to /api/users/
 * @Desc get all users
 * @Access public/test
 */

router.get('/', async (req, res) => {
  //   db.query(queries.selectAllUsers, (err, result) => {
  //     if (err) {
  //       return res.status(400).json(err);
  //     }
  User.findAll()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).json(err));
});

/**
 * @Route GET to /api/users/:user_id
 * @Desc get a user by id
 * @Access public
 */

router.get('/userid/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  //validate user_id
  User.findAll({ where: { user_id } })
    .then(users => {
      if (!users.length) {
        res.status(400).json({ error: 'no such user id' });
      }
      const user = users[0];
      res.status(200).json({ user });
    })
    .catch(err => console.log(err));
});

/**
 * @Route POST to /api/users/register
 * @Desc register a user
 * @Access public
 */

router.post('/register', async (req, res) => {
  // validate inputs
  let { errors, isValid } = registerInputValidation(req.body);

  if (!isValid) {
    console.log('register input failure');
    return res.status(400).json({ errors });
  }

  const data = req.body;

  // unique email and user validation
  let hasEmail = await User.findAll({
    where: {
      email: req.body.email,
    },
  }).catch(err => res.status(400).json({ err }));

  if (hasEmail.length) {
    isValid = false;
    errors.email = 'Email already exists';
  }

  let hasUserName = await User.findAll({
    where: {
      user_name: req.body.user_name,
    },
  }).catch(err => res.status(400).json({ err }));

  if (hasUserName.length) {
    isValid = false;
    errors.userName = 'Username already exists';
  }

  if (!isValid) {
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

  // default date creation doesnt work (Sequelize.NOW)

  const now = Date.now();
  data.created_at = now;
  data.updated_at = now;

  User.build(data)
    .save()
    .then(user => res.status(200).json(user))
    .catch(err => {
      return res.status(400).json({ err });
    });
});

/**
 * @Route GET to /api/users/login
 * @Desc log in to account / return jwt token
 * @Access private
 */

router.post('/login', async (req, res) => {
  let { errors, isValid } = loginInputValidation(req.body);
  if (!isValid) {
    res.status(400).json({ errors });
  }

  const email = req.body.email;
  const password = req.body.password;

  //check if email exists

  const user = await User.findOne({ where: { email } }).catch(err =>
    console.log(err)
  );

  if (!user) {
    errors.email = 'User not found';
    return res.status(400).json({ errors });
  }

  //check if password matches

  const isMatch = await bcrypt
    .compare(password, user.password)
    .catch(err => console.log(err));

  if (!isMatch) {
    errors.password = 'Email and password do not match';
    return res.status(400).send({ errors });
  }
  //create jwt payload
  const payload = {
    user_id: user.user_id,
    user_name: user.user_name,
    email: user.email,
  };
  //   console.log(payload);

  //sign the payload
  jwt.sign(payload, secretOrKey, (err, token) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({
      success: true,
      token,
    });
  });
});

/**
 * @route GET to /api/users/currentuser
 * @desc access user info using jwt auth token
 * @access private
 */

router.get(
  '/currentuser',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({
      user_id: req.user.user_id,
      user_name: req.user.user_name,
      email: req.user.email,
    });
  }
);

/**
 * @route DELETE to /api/users/current
 * @desc delete user using jwt auth token
 * @access private
 */

router.delete(
  '/removeuser',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user_id = req.user.user_id;
    User.destroy({ where: { user_id } })
      .then(() =>
        res.status(200).json({ success: true, message: 'user removed' })
      )
      .catch(err => console.log(err));
  }
);

/**
 * @Route PUT to /api/users/currentuser
 * @Desc update user information
 * @Access private
 */

router.put(
  '/currentuser',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // validate user inputs
    let { errors, isValid } = updateUserValidation(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const user = await User.findOne({
      where: { user_id: req.user.user_id },
    }).catch(err => console.log(err));
    // const user = { ...req.body };
    // compare pw hashes
    const isMatch = await bcrypt
      .compare(req.body.password, user.password)
      .catch(err => {
        throw err;
      });

    if (!isMatch) {
      errors.password = 'Invalid password';
      return res.status(400).json({ errors });
    }

    let newHash;
    // check if password is being updated
    if (req.body.newPassword.length) {
      // checks that new pw is different after validating current pw
      if (isMatch && req.body.newPassword === req.body.password) {
        errors.password =
          'New password must be different from current password';
        return res.status(400).json({ errors });
      }
      // create new pw hash
      newHash = await bcrypt
        .hash(req.body.newPassword, await bcrypt.genSalt())
        .catch(err => {
          throw err;
        });
    }

    const updatedUser = populateUpdatedUser(user, req.body, newHash);

    //insert updated data into table
    if (!isEmpty(updatedUser)) {
      User.update(
        { ...updatedUser },
        {
          where: {
            user_id: req.user.user_id,
          },
          returning: true,
        }
      )
        .then(result => {
          const returnedUser = result[1][0];
          res.status(200).json(returnedUser);
        })
        .catch(err => console.log(err));
    } else {
      res.status(200).json({ message: 'No changes made' });
    }
  }
);

const populateUpdatedUser = (currentData, newData, newPassword) => {
  const deltaUser = {};
  if (currentData.user_name !== newData.user_name) {
    deltaUser.user_name = newData.user_name;
  }
  if (currentData.name !== newData.name) {
    deltaUser.name = newData.name;
  }
  if (newPassword) {
    deltaUser.password = newPassword;
  }
  if (!isEmpty(deltaUser)) {
    const updated_at = Date.now();
    deltaUser.updated_at = updated_at;
  }
  return deltaUser;
};

module.exports = router;
