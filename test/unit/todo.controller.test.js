const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../model/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');

describe('TodoController.createTodo', () => {
  let req, res, next;

  beforeEach(() => {
    TodoModel.create = jest.fn();
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
  });

  it('should have a createTodo funtion', () => {
    expect(typeof TodoController.createTodo).toBe('function');
  });

  it('should call TodoModel.create', () => {
    req.body = newTodo;
    TodoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it('should return 201 response code', () => {
    req.body = newTodo;
    TodoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return JSON body in response', () => {
    req.body = newTodo;
    // @ts-ignore
    TodoModel.create.mockReturnValue(newTodo);
    TodoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });
});
