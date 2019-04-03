const createRecipesTable = `
CREATE TABLE recipes\n 
(
  recipe_id serial PRIMARY KEY,
  user_id integer NOT NULL,
  recipe_name VARCHAR NOT NULL,
  ingredients VARCHAR,
  directions VARCHAR,
  keywords VARCHAR,
  regions VARCHAR,
  link VARCHAR,
  created_at TIMESTAMPTZ NOT NULL
);`;


module.exports = createRecipesTable;
