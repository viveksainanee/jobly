process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../../app');
const db = require('../../db');

beforeEach(async function() {
  //seed with some data
  await db.query(
    `INSERT INTO companies (handle, name, num_employees, description, logo_url)
    VALUES ('BEEF', 'Andrews Hot Dogs', '3', 'not beef hot dogs', 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg')`
  );

  await db.query(
    `INSERT INTO companies (handle, name, num_employees, description, logo_url)
    VALUES ('INTC', 'Intel', '45345', 'We make vegan chips', 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg')`
  );

  await db.query(
    `INSERT INTO companies (handle, name, num_employees, description, logo_url)
    VALUES ('MYSP', 'MySpace', '1', '#2 social media site', 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg')`
  );
});

afterEach(async function() {
  await db.query('DELETE FROM companies');
});

afterAll(async function() {
  await db.end();
});

describe('Search for comnpanies at /companies', async function() {
  test('Gets companies from query', async function() {
    const res = await request(app).get('/companies');
    expect(res.statusCode).toBe(200);
    expect(res.body.companies).toEqual([
      { handle: 'BEEF', name: 'Andrews Hot Dogs' },
      { handle: 'INTC', name: 'Intel' },
      { handle: 'MYSP', name: 'MySpace' }
    ]);
  });

  test('Gets companies from query handle', async function() {
    const res = await request(app).get('/companies?search=BEEF');
    expect(res.statusCode).toBe(200);
    expect(res.body.companies).toEqual([
      { handle: 'BEEF', name: 'Andrews Hot Dogs' }
    ]);
  });

  test('Gets companies from query max employees', async function() {
    const res = await request(app).get('/companies?max_employees=100');
    expect(res.statusCode).toBe(200);
    expect(res.body.companies).toEqual([
      { handle: 'BEEF', name: 'Andrews Hot Dogs' },
      { handle: 'MYSP', name: 'MySpace' }
    ]);
  });

  test('Gets companies from query min employees', async function() {
    const res = await request(app).get('/companies?min_employees=100');
    expect(res.statusCode).toBe(200);
    expect(res.body.companies).toEqual([{ handle: 'INTC', name: 'Intel' }]);
  });
});
