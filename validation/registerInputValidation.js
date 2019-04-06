const validator = require('validator');
const isEmpty = require('./is-Empty.js');

module.exports = registerInputValidation = data => {
  let isValid = true;
  let errors = {};

  //user_name
  if (isEmpty(data.user_name)) {
    data.user_name = '';
    errors.userName = 'Username field cannot be empty';
  }
  //email
  if (isEmpty(data.email)) {
    data.user_name = '';
    errors.email = 'Email field cannot be empty';
  }
  //name
  if (isEmpty(data.name)) {
    data.name = '';
    errors.name = 'Name field cannot be empty';
  }
  //password
  if (isEmpty(data.password)) {
    data.password = '';
    errors.password = 'Password field cannot be empty';
  }

  if (
    !errors.userName &&
    !validator.isLength(data.user_name, { min: 6, max: 32 })
  ) {
    errors.userName = 'Username must be between 6 and 32 characters long';
  }

  if (!errors.email && !validator.isEmail(data.email)) {
    errors.email = 'Enter a valid email';
  }

  // @Todo: add password strength checking
  if (
    !errors.password &&
    !validator.isLength(data.password, { min: 6, max: 32 })
  ) {
    errors.password = 'Password must be between 6 and 32 characters long';
  }

  if (!isEmpty(errors)) {
    isValid = false;
  }

  return { errors, isValid };
};
