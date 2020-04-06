const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../model/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const todos = require('../mock-data/todos.json');

describe('TodoController.createTodo', () => {
  let req, res, next;

  beforeEach(() => {
    TodoModel.create = jest.fn();
    TodoModel.find = jest.fn();
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('should have a getTodo function', () => {
    expect(typeof TodoController.getTodos).toBe('function');
  });

  it('should call TodoModel.find', async () => {
    await TodoController.getTodos(req, res, next);
    expect(TodoModel.find).toBeCalled();
  });

  it('should return 200 response code', async () => {
    await TodoController.getTodos(req, res, next);

    expect(res.statusCode).toBe(200);
  });

  it('should return JSON todo list', async () => {
    const resolvedPromise = Promise.resolve(todos);

    // @ts-ignore
    TodoModel.find.mockReturnValue(resolvedPromise);

    await TodoController.getTodos(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(todos);
  });

  it('should have a createTodo funtion', () => {
    expect(typeof TodoController.createTodo).toBe('function');
  });

  it('should call TodoModel.create', async () => {
    req.body = newTodo;
    await TodoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it('should return 201 response code', async () => {
    req.body = newTodo;
    await TodoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return JSON body in response', async () => {
    req.body = newTodo;
    // @ts-ignore
    TodoModel.create.mockReturnValue(newTodo);
    await TodoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'Done property missing' };
    const rejectedPromise = Promise.reject(errorMessage);

    // @ts-ignore
    TodoModel.create.mockReturnValue(rejectedPromise);

    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
