const createUsersTable = `
CREATE TABLE users
(
  user_id  serial PRIMARY KEY,
  user_name VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
`;

module.exports = createUsersTable;
