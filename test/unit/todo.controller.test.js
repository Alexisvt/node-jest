const TodoController = require('../../controllers/todo.controller');

describe('TodoController.createTodo', () => {
  it('should have a createTodo funtion', () => {
    expect(typeof TodoController.createTodo).toBe('function');
  });
});
