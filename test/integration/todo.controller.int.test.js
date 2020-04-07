const request = require('supertest');
const app = require('../../app');
const newTodo = require('../mock-data/new-todo.json');

const endpointURL = '/todos/';

describe(endpointURL, () => {
  test(`GET ${endpointURL}:id`, async () => {
    const { body, status } = await request(app).get(`${endpointURL}5e8a96516e970f6e931a08c4`);

    expect(status).toBe(200);
    expect(body.title).toBeDefined();
    expect(body.done).toBeDefined();
  });

  test(`GET ${endpointURL}`, async () => {
    const { body, status } = await request(app).get(endpointURL);

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
    expect(body[0].title).toBeDefined();
    expect(body[0].done).toBeDefined();
  });

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

describe(endpointURL, () => {});
