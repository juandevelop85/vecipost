const app = require('../app');
const supertest = require('supertest');

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

describe('POST get error 400 Bad Request', () => {
  test('Datos incorrectos', async () => {
    const data = { post_id: 68, isLike: true };
    const response = await supertest(app).post('/postsevents/v1/likePost').send(data);
    expect(response.statusCode).toBe(400);
  });
});

describe('POST get only 1 row', () => {
  test('Datos correctos', async () => {
    const data = { post_id: 68, isLike: true };
    const commonHeaders = { authorization: 'juandevelop85@gmail.com' };
    const response = await supertest(app).post('/postsevents/v1/likePost').send(data).set(commonHeaders);
    expect(response.statusCode).toBe(200);

    const body = response.body;
    expect(body.status).toEqual('SUCCESS');
    expect(body.posts).toBeDefined();

    const posts = body.posts;
    expect(posts.length).toEqual(1);

    const postObject = posts[0];
    expect(postObject.u_like_count).toEqual(1);
  });
});

describe('POST get u_like_count 1', () => {
  test('Obtener u_like_count = 1', async () => {
    const data = { post_id: 68, isLike: true };
    const commonHeaders = { authorization: 'juandevelop85@gmail.com' };
    const response = await supertest(app).post('/postsevents/v1/likePost').send(data).set(commonHeaders);
    
    const body = response.body;
    const posts = body.posts;
    const postObject = posts[0];

    expect(postObject.u_like_count).toEqual(1);
  });
});

describe('POST get only 1 row', () => {
    test('Limpiar la seleccion dada', async () => {
      const data = { post_id: 68, isLike: null };
      const commonHeaders = { authorization: 'juandevelop85@gmail.com' };
      const response = await supertest(app).post('/postsevents/v1/likePost').send(data).set(commonHeaders);
      
      const body = response.body;
      const posts = body.posts;
      const postObject = posts[0];
      expect(postObject.u_like_count).toEqual(null);
    });
  });
