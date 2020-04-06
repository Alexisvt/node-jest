const request = require('supertest');
const app = require('../../app');
const newTodo = require('../mock-data/new-todo.json');

const endpointURL = '/todos/';

describe(endpointURL, () => {
  it(`POST ${endpointURL}`, async () => {
    // @ts-ignore
    const { body, statusCode } = await request(app).post(endpointURL).send(newTodo);

    expect(statusCode).toBe(201);
    expect(body.title).toBe(newTodo.title);
    expect(body.done).toBe(newTodo.done);
  });
});
