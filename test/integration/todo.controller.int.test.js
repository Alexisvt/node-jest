const request = require('supertest');
const app = require('../../app');
const newTodo = require('../mock-data/new-todo.json');

const endpointURL = '/todos/';
let firstTodo;
let createdTodo;
let fakeTodoItem = {
  _id: '5e8a5a641bbf86731784d0a7',
  title: 'Make first unit test',
  done: false,
  __v: 0,
};

describe(endpointURL, () => {
  test(`GET ${endpointURL}`, async () => {
    const { body, status } = await request(app).get(endpointURL);

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
    expect(body[0].title).toBeDefined();
    expect(body[0].done).toBeDefined();
    firstTodo = body[0];
  });

  test(`PUT ${endpointURL}`, async () => {
    // we change some data
    firstTodo.done = true;
    firstTodo.title = 'New task';

    const { body, status } = await request(app).put(endpointURL).send(firstTodo);

    expect(status).toBe(200);
    expect(body.title).toBe(firstTodo.title);
    expect(body.done).toBe(firstTodo.done);
  });

  test('PUT 404 when a todo doesnt exists', async () => {
    const { status } = await request(app).put(`${endpointURL}`).send(fakeTodoItem);

    expect(status).toBe(404);
  });

  test(`GET todo by Id ${endpointURL}:id`, async () => {
    const { body, status } = await request(app).get(`${endpointURL}${firstTodo['_id']}`);

    expect(status).toBe(200);
    expect(body.title).toBe(firstTodo.title);
    expect(body.done).toBe(firstTodo.done);
  });

  test(`GET 404 when a todo doesnt exists ${endpointURL}:id`, async () => {
    const { status } = await request(app).get(`${endpointURL}${fakeTodoItem._id}`);

    expect(status).toBe(404);
  });

  it(`POST ${endpointURL}`, async () => {
    const { body, status } = await request(app).post(endpointURL).send(newTodo);

    expect(status).toBe(201);
    expect(body.title).toBe(newTodo.title);
    expect(body.done).toBe(newTodo.done);
    createdTodo = body;
  });

  test(`DELETE ${endpointURL}`, async () => {
    const { body, status } = await request(app).delete(`${endpointURL}/${createdTodo['_id']}`);

    expect(status).toBe(200);
    expect(body).toStrictEqual(createdTodo);
  });

  test('DELETE 404 status when a todo doesnt exists', async () => {
    const { status } = await request(app).delete(`${endpointURL}${fakeTodoItem._id}`);

    expect(status).toBe(404);
  });

  it(`should return error 500 on malformed data with POST ${endpointURL}`, async () => {
    const { status, body } = await request(app)
      .post(endpointURL)
      .send({ title: 'Missing done property' });

    expect(status).toBe(500);
    expect(body).toStrictEqual({
      message: 'Todo validation failed: done: Path `done` is required.',
    });
  });
});
