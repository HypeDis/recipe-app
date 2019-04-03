const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const passport = require('passport');

// routes
const Users = require('./routing/api/usersRoutes');
const Recipes = require('./routing/api/recipesRoutes');

const PORT = process.env.PORT || 3000;

// middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(passport.initialize());

// load passport config
require('./config/passportConfig')(passport);

app.use('/api/users', Users);
app.use('/api/recipes', Recipes);

app.listen(PORT, () => {
  console.log(`app running on ${PORT}`);
});

module.exports = { PORT };
