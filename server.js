const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./dB/postgres');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    info: 'Node and postgresql rest api',
  });
});

const Users = require('./routing/api/Users');

app.use('/users', Users);

app.listen(PORT, () => {
  console.log(`app running on ${PORT}`);
});

module.exports = { PORT };
