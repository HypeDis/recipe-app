const Router = require('express-promise-router');
const passport = require('passport');

const db = require('../../dB/postgresPool');
const queries = require('./../../dB/postgresQueries');

const router = new Router();

/**
 * @Route GET to /recipes
 * @Descr Get all recipes
 * @Access Test
 */

router.get('/', (req, res) => {
  db.query(queries.getAllRecipes, (err, result) => {
    if (err) throw { err };
    res.status(200).json(result.rows);
  });
});

/**
 * @Route GET to /recipes/currentuser
 * @Descr Get all user recipes
 * @Access private
 */

router.get(
  '/currentuser/all',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    db.query(queries.getAllUserRecipes, [req.user_id], (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).json(result.rows);
    });
  }
);

/**
 * @Route GET to /recipes/currentuser/recipe/:recipe_id
 * @Descr Get a single user recipe
 * @Access private
 */

/**
 * @Route POST to /recipes/currentuser
 * @Descr Create a recipe
 * @Access private
 */

/**
 * @Route PUT to /recipes/currentuser
 * @Descr Update a recipe
 * @Access private
 */

/**
 * @Route DELETE to /recipes/currentuser/recipe/:recipe_id
 * @Descr Delete a recipe
 * @Access private
 */

module.exports = router;
