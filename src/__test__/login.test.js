const app = require('../app');
const supertest = require('supertest');

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

describe('POST Token with real credentials', () => {
  test('Datos correctos', async () => {
    const data = { login: 'UsuarioExterno', password: 'Prueba1234' };
    const response = await supertest(app).post('/users/security/v1/login').send(data);
    expect(response.statusCode).toBe(200);
    const body = response.body;
    expect(body.token).toBeDefined();
    expect(body.uuid).toBeDefined();
  });
});

describe('Not get Token with real credentials', () => {
  test('Datos incorrectos', async () => {
    const data = { login: 'UsuarioExterno', password: 'Prueba1234s' };
    const response = await supertest(app).post('/users/security/v1/login').send(data);
    expect(response.statusCode).toBe(200);
    const body = response.body;
    expect(body.token).toBeUndefined();
    expect(body.uuid).toBeUndefined();
  });
});
