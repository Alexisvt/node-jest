const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../model/todo.model');

describe('TodoController.createTodo', () => {
  beforeEach(() => {
    TodoModel.create = jest.fn();
  });

  it('should have a createTodo funtion', () => {
    expect(typeof TodoController.createTodo).toBe('function');
  });

  it('should call TodoModel.create', () => {
    TodoController.createTodo();
    expect(TodoModel.create).toBeCalled();
  });
});
