const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  done: {
    required: true,
    type: String,
  },
});

const TodoModel = mongoose.model('Todo', TodoSchema);

module.exports = TodoModel;
