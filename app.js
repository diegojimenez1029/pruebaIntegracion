
const express = require('express');
const app = express();
const data = require('./db.json');

app.use(express.json());

app.get('/users', (req, res) => {
  res.status(200).json(data.users);
});

app.get('/users/:id', (req, res) => {
  const user = data.users.find(u => u.id === parseInt(req.params.id, 10));
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

module.exports = app;
