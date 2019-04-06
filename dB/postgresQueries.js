const queries = {
  selectUserByEmail: 'SELECT * FROM users WHERE email = $1',
  selectUserById: 'SELECT * FROM users WHERE user_id = $1',
  selectAllUsers: 'SELECT * FROM users ORDER BY user_id ASC',
  insertNewUser:
    'INSERT INTO users (user_name, email, name, password, created_at) VALUES ($1, $2, $3, $4, $5)',
  deleteUserById: 'DELETE FROM users WHERE user_id = $1',
  getAllRecipes: 'SELECT * from recipes ORDER BY user_id ASC, recipe_id ASC',
  getAllUserRecipes: `SELECT * from recipes WHERE user_id = $1`,
};

// idea : change everything to methods to generate dynamic queries

module.exports = queries;
