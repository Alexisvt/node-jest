const request = require('supertest');
const app = require('../../app');
const newTodo = require('../mock-data/new-todo.json');

const endpointURL = '/todos/';

describe(endpointURL, () => {
  it(`POST ${endpointURL}`, async () => {
    const { body, status } = await request(app).post(endpointURL).send(newTodo);

    expect(status).toBe(201);
    expect(body.title).toBe(newTodo.title);
    expect(body.done).toBe(newTodo.done);
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
