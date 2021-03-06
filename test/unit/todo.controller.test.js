const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../model/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const todos = require('../mock-data/todos.json');
const availableTodo = require('../mock-data/todo.json');

let req, res, next;

beforeEach(() => {
  TodoModel.create = jest.fn();
  TodoModel.find = jest.fn();
  TodoModel.findById = jest.fn();
  TodoModel.findByIdAndUpdate = jest.fn();
  TodoModel.findByIdAndRemove = jest.fn();
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('TodoController.deleteTodo', () => {
  it('should have a deleteTodo method', async () => {
    expect(typeof TodoController.deleteTodo).toBe('function');
  });

  it('should call findByIdAndRemove with and Id and options', async () => {
    const id = '5e8a9a646bbf86731784d0a5';

    const options = {
      useFindAndModify: false,
    };

    req.params = {
      id,
    };

    await TodoController.deleteTodo(req, res, next);

    expect(TodoModel.findByIdAndRemove).toBeCalledWith(id, options);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return 200 and the deleted todo', async () => {
    const deletedTodo = {
      _id: '5e8a9a646bbf86731784d0a5',
      title: 'Make first unit test',
      done: false,
      __v: 0,
    };

    req.params = {
      id: '5e8a9a646bbf86731784d0a5',
    };

    // @ts-ignore
    TodoModel.findByIdAndRemove.mockReturnValue(deletedTodo);

    await TodoController.deleteTodo(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(deletedTodo);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return 404 when a todo doesnt exists', async () => {
    // @ts-ignore
    TodoModel.findByIdAndRemove.mockReturnValue(null);

    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should handle errors', async () => {
    const errorMessage = {
      message: 'It wasnt possible to delete the todo',
    };

    const rejectedPromise = Promise.reject(errorMessage);

    // @ts-ignore
    TodoModel.findByIdAndRemove.mockReturnValue(rejectedPromise);

    await TodoController.deleteTodo(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('TodoController.updateTodo', () => {
  it('should have an updateTodo method', async () => {
    expect(typeof TodoController.updateTodo).toBe('function');
  });

  it('should call findByIdAndUpdate with a todo and options', async () => {
    const options = {
      new: true,
      useFindAndModify: false,
    };
    req.body = availableTodo;

    await TodoController.updateTodo(req, res, next);

    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(
      availableTodo['_id'],
      availableTodo,
      options
    );
  });

  it('should return the updated todo item and status code 200', async () => {
    req.body = availableTodo;

    // @ts-ignore
    TodoModel.findByIdAndUpdate.mockReturnValue(availableTodo);

    await TodoController.updateTodo(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toBeTruthy();

    expect(res._getJSONData()).toStrictEqual(availableTodo);
  });

  it('should return 404 when a todo doesnt exists', async () => {
    const fakeTodo = {
      _id: '5e8b9bdda5218709c9eae7a0',
      title: 'Make first unit test',
      done: false,
    };

    req.body = fakeTodo;

    // @ts-ignore
    TodoModel.findByIdAndUpdate.mockReturnValue(null);

    await TodoController.updateTodo(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should handle errors', async () => {
    const errorMessage = {
      message: 'It wasnt possible to update the todo',
    };

    const rejectedPromise = Promise.reject(errorMessage);

    // @ts-ignore
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);

    await TodoController.updateTodo(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  });
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

  it('should return 400 response code when no todo has been found', async () => {
    req.params = {
      id: 'non existing todo id',
    };

    // @ts-ignore
    TodoModel.findById.mockReturnValue({});

    await TodoController.getTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toBeTruthy();
  });

  it('should handle errors', async () => {
    const errorMessage = {
      message: 'No todo found',
    };

    req.params = {
      id: 'invalid id',
    };

    const rejectedPromise = Promise.reject(errorMessage);

    // @ts-ignore
    TodoModel.findById.mockReturnValue(rejectedPromise);

    await TodoController.getTodo(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
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
