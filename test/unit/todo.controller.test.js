const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../model/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const todos = require('../mock-data/todos.json');

let req, res, next;

beforeEach(() => {
  TodoModel.create = jest.fn();
  TodoModel.find = jest.fn();
  TodoModel.findById = jest.fn();
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('TodoController.getTodo', () => {
  it('should have a getTodo function', () => {
    expect(typeof TodoController.getTodo).toBe('function');
  });

  it('should call TodoModel.find with an Id', async () => {
    req.params = {
      id: newTodo['_id'],
    };

    await TodoController.getTodo(req, res, next);

    expect(TodoModel.findById).toHaveBeenCalledWith(req.params.id);
  });

  it('should return 200 response code and a todo', async () => {
    const todo = {
      _id: '5e8b9bdda5214709c9ebe7a0',
      title: 'Make first unit test',
      done: false,
    };

    req.params = {
      id: todo['_id'],
    };

    // @ts-ignore
    TodoModel.findById.mockReturnValue(todo);

    await TodoController.getTodo(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(todo);
  });
});

describe('TodoController.getTodos', () => {
  it('should have a getTodos function', () => {
    expect(typeof TodoController.getTodos).toBe('function');
  });

  it('should call TodoModel.find', async () => {
    await TodoController.getTodos(req, res, next);
    expect(TodoModel.find).toHaveBeenCalledWith();
  });

  it('should return 200 response code and all todos', async () => {
    // @ts-ignore
    TodoModel.find.mockReturnValue(todos);

    await TodoController.getTodos(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(todos);
  });

  it('should return 404 response code when no todos has been found', async () => {
    const resolvedPromise = Promise.resolve([]);

    // @ts-ignore
    TodoModel.find.mockReturnValue(resolvedPromise);

    await TodoController.getTodos(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should handle errors in getTodos', async () => {
    const errorMessage = { message: 'Error findings' };
    const rejectedPromise = Promise.reject(errorMessage);

    // @ts-ignore
    TodoModel.find.mockReturnValue(rejectedPromise);

    await TodoController.getTodos(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('TodoController.createTodo', () => {
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
