const request = require('supertest')(`https://reqres.in/api`);

describe('example', () => {

  it('shows how supertest works', () => {
    return request
      .get('/users')
      .expect(200);
  });
});
