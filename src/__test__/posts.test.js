const app = require('../app');
const supertest = require('supertest');

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

describe('POST get only 10 rows', () => {
  test('Datos correctos', async () => {
    const response = await supertest(app).get('/posts/v1/getPosts/10/0');
    expect(response.statusCode).toBe(200);
    const body = response.body;
    expect(body.posts).toBeDefined();
    let posts = body.posts;
    expect(posts.length).toEqual(10);
    expect(body.status).toEqual('SUCCESS');
  });
});

describe('POST register post', () => {
  test('Insercion', async () => {
    const data = { name: 'Test unitario', content: 'Realizando prueba unitaria', user_email: 'juandevelop85@gmail.com' };
    const response = await supertest(app).post('/posts/v1/createPost').send(data);
    expect(response.statusCode).toBe(200);
    // const body = response.body;
    // expect(body.posts).toBeUndefined();
    // expect(body.status).toBeUndefined();
  });
});


describe('POST register post with bad request', () => {
  test('Fail insert', async () => {
    const data = { content: 'Realizando prueba unitaria', user_email: true };
    const response = await supertest(app).post('/posts/v1/createPost').send(data);
    expect(response.statusCode).toBe(400);
    const body = response.body;
    expect(body.message).toBeDefined();
    // expect(body.status).toBeUndefined();
  });
});
