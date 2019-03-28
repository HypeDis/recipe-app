const express = require('express');
const router = express.Router();

const db = require('../../dB/postgresPool');

/**
 * @Route GET to /recipes
 * @Descr Get all recipes
 * @Access Test
 */

const getAllRecipes = (req, res) => {
  db.query('SELECT * FROM recipes ORDER BY user_id ASC', (err, result) => {
    if (err) {
      throw err;
    }
    res.status(200).json(result.rows);
  });
};

router.get('/', getAllRecipes);

/**
 * @Route GET to /recipes/:user_id
 * @Descr Get all user recipes
 * @Access Test
 */

const getAllUserRecipes = (req, res) => {
  /**
   * @todo
   * add authentication
   * only get data relevant to building homepage
   */
  const user_id = req.params.user_id;
  db.query(
    'SELECT * FROM recipes WHERE user_id = $1 ORDER BY recipe_id ASC',
    [user_id],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).json(result.rows);
    }
  );
};

router.get('/:user_id', getAllRecipes);

/**
 * @Route GET to /recipes/:user_id/:recipe_id
 * @Descr Get a recipe by id
 * @Access Private
 */

const getRecipe = (req, res) => {
  res.status(200).json(req.params);
  db.query(
    'SELECT * FROM recipes WHERE user_id = $1, recipe_id = $2',
    [user_id, recipe_id],
    (err, result) => {}
  );
};
router.get('/:user_id/:recipe_id', getRecipe);

/**
 * @Route POST to /recipes/:user_id/
 * @Descr Create a new recipe
 * @Access Private
 */

const createRecipe = (req, res) => {
  /**
   * @todo
   * user authentication
   * validate data
   * validate correct user
   * create dynamic query
   */
  const user_id = req.params.user_id;

  const {
    recipe_name,
    ingredients,
    directions,
    keywords,
    regions,
    link,
  } = req.body;

  const created_at = new Date();

  const recipeData = [
    user_id,
    recipe_name,
    ingredients,
    directions,
    keywords,
    regions,
    link,
    created_at,
  ];

  // temp validation
  const validatedRecipeData = recipeData.map(data => {
    if (data) {
      return data;
    } else {
      return '';
    }
  });

  db.query(
    'INSERT INTO recipes (user_id, recipe_name, ingredients, directions, keywords, regions, link, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    validatedRecipeData,
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).send('recipe created');
    }
  );
};

router.post('/:user_id', createRecipe);

module.exports = router;
