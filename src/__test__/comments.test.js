const app = require('../app');
const supertest = require('supertest');

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

describe('GET get only 10 rows', () => {
  test('Datos correctos', async () => {
    const response = await supertest(app).get('/comments/v1/getPostComments/2');
    expect(response.statusCode).toBe(200);
    const body = response.body;
    expect(body.comments).toBeDefined();
    expect(body.status).toBeDefined();
  });
});

describe('POST Not register post', () => {
  test('Insercion', async () => {
    const data = { post_id: 2, name: 'Creado desde postman', content: 'Mi comentario es el mejor', user_email: 'juandevelop85@gmail.com' };
    const response = await supertest(app).post('/comments/v1/createComment').send(data);
    expect(response.statusCode).toBe(200);
    // const body = response.body;
    // expect(body.posts).toBeUndefined();
    // expect(body.status).toBeUndefined();
  });
});
