const express = require('express');
const todoController = require('../controllers/todo.controller');
const router = express.Router();

router.post('/', todoController.createTodo);

router.get('/:id', todoController.getTodo);

router.get('/', todoController.getTodos);

router.put('/', todoController.updateTodo);

router.delete('/:id', todoController.deleteTodo);

module.exports = router;
