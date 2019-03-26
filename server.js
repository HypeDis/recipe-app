const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./dB/queries');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    info: 'Node and postgresql rest api',
  });
});

app.get('/users', db.getUsers);

app.get('/users/:id', db.getUserByID);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

app.listen(PORT, () => {
  console.log(`app running on ${PORT}`);
});

module.exports = { PORT };
