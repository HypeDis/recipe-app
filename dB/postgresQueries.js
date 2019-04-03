const queries = {
  selectUserByEmail: 'SELECT * FROM users WHERE email = $1',
  selectUserById: 'SELECT * FROM users WHERE user_id = $1',
  selectAllUsers: 'SELECT * FROM users ORDER BY user_id ASC',
  insertNewUser:
    'INSERT INTO users (user_name, email, name, password, created_at) VALUES ($1, $2, $3, $4, $5)',
};

module.exports = queries;
