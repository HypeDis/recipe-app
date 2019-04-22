const isEmpty = require('./is-empty');
const validator = require('validator');

module.exports = function(data) {
  let isValid = true;
  let errors = {};
  //username
  if (isEmpty(data.user_name)) {
    data.user_name = '';
    errors.userName = 'please enter a new user name';
  }

  if (
    !errors.userName &&
    !validator.isLength(data.user_name, { min: 6, max: 32 })
  ) {
    errors.userName = 'Username must be between 6 and 32 characters long';
  }
  //name
  if (isEmpty(data.name)) {
    data.name = '';
    errors.name = 'please enter a new name';
  }

  // if (!errors.name && !validator.isLength(data.name, { min: 6, max: 32 })) {
  //   errors.userName = 'Name must be between 6 and 32 characters long';
  // }

  //password
  if (isEmpty(data.password)) {
    errors.password = 'please enter current password';
  }

  //newPassword
  if (isEmpty(data.newPassword)) {
    data.newPassword = '';
  }

  // if (validator.isEmpty(data.newPassword)) {
  //   errors.newPassword = 'please enter a new password';
  // }
  if (data.newPassword.length || data.newPassword2.length) {
    if (!validator.isLength(data.newPassword, { min: 6, max: 32 })) {
      errors.newPassword = 'new password must be between 6 and 32 characters';
    }

    //confirmNewPassword
    if (data.newPassword2 !== data.newPassword) {
      errors.newPassword2 = 'passwords do not match';
    }
  }

  if (!isEmpty(errors)) {
    isValid = false;
  }
  return { errors, isValid };
};
