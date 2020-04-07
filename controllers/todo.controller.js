const TodoModel = require('../model/todo.model');

exports.createTodo = async (req, res, next) => {
  try {
    const createdTodo = await TodoModel.create(req.body);
    res.status(201).json(createdTodo);
  } catch (error) {
    next(error);
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    const todos = await TodoModel.find();

    if (todos && todos.length) {
      res.status(200).json(todos);
    } else {
      res.status(404).json(todos);
    }
  } catch (error) {
    next(error);
  }
};

exports.getTodo = async (req, res, next) => {
  const todo = await TodoModel.findById(req.params.id);

  res.status(200).json(todo);
};
