const express = require('express');
const app = express();
const todoRoutes = require('./routes/todo.route');
const mongodb = require('./mongodb/mongodb.connect');

mongodb.connect();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.use('/todos', todoRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

module.exports = app;
