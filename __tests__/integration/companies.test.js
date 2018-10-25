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

/**  Tests for search routes**/
describe('Search for comnpanies at /companies', async function() {
  test('Gets companies from query successfully', async function() {
    const res = await request(app).get('/companies');
    expect(res.statusCode).toBe(200);
    expect(res.body.companies).toEqual([
      { handle: 'BEEF', name: 'Andrews Hot Dogs' },
      { handle: 'INTC', name: 'Intel' },
      { handle: 'MYSP', name: 'MySpace' }
    ]);
  });

  test('Gets companies from query, search by handle', async function() {
    const res = await request(app).get('/companies?search=BEEF');
    expect(res.statusCode).toBe(200);
    expect(res.body.companies).toEqual([
      { handle: 'BEEF', name: 'Andrews Hot Dogs' }
    ]);
  });

  test('Gets companies from query, search by max employees', async function() {
    const res = await request(app).get('/companies?max_employees=100');
    expect(res.statusCode).toBe(200);
    expect(res.body.companies).toEqual([
      { handle: 'BEEF', name: 'Andrews Hot Dogs' },
      { handle: 'MYSP', name: 'MySpace' }
    ]);
  });

  test('Gets companies from query, search by min employees', async function() {
    const res = await request(app).get('/companies?min_employees=100');
    expect(res.statusCode).toBe(200);
    expect(res.body.companies).toEqual([{ handle: 'INTC', name: 'Intel' }]);
  });

  test('Get no results if it doesnt match any query', async function() {
    const res = await request(app).get('/companies?search=alksjdflkasjdflkj');
    expect(res.statusCode).toBe(200);
    expect(res.body.companies).toEqual([]);
  });

  test('tests error if string instead of int', async function() {
    const res = await request(app).get('/companies?max_employees=hello');
    expect(res.statusCode).toBe(400);
  });
});

/** Tests for the post route*/

describe('Creating a new company at /companies', async function() {
  test('Tests creating a newcompany', async function() {
    const res = await request(app)
      .post('/companies')
      .send({
        handle: 'CHIP',
        name: 'Chipotsss',
        num_employees: 30,
        description: 'Chipotle bowls and burritos',
        logo_url: 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg'
      });
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual({
      description: 'Chipotle bowls and burritos',
      handle: 'CHIP',
      logo_url: 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg',
      name: 'Chipotsss',
      num_employees: 30
    });
  });

  test('Tests a post without data', async function() {
    const res = await request(app).post('/companies');
    expect(res.statusCode).toBe(400);
  });
});

/** Tests get for  getting data on a company by handle*/

describe('Getting info of a company by their handle /companies/:handle', async function() {
  test('Tests getting a specific company', async function() {
    const res = await request(app).get('/companies/BEEF');
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual({
      company: {
        description: 'not beef hot dogs',
        handle: 'BEEF',
        logo_url:
          'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg',
        name: 'Andrews Hot Dogs',
        num_employees: 3
      }
    });
  });

  test('Tests a get without a real handle', async function() {
    const res = await request(app).post('/companies/ALKSDJF');
    expect(res.statusCode).toBe(404);
  });
});

/** Tests patching a company by handle*/

describe('updating some of the company by their handle /companies/:handle', async function() {
  test('Tests updating a specific company', async function() {
    const res = await request(app)
      .patch('/companies/BEEF')
      .send({
        handle: 'BEEF',
        name: 'Vegan Steaks',
        num_employees: 30,
        description: 'Vegan Steaks, dairy-free',
        logo_url: 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg'
      });
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual({
      company: {
        description: 'Vegan Steaks, dairy-free',
        handle: 'BEEF',
        logo_url:
          'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg',
        name: 'Vegan Steaks',
        num_employees: 30
      }
    });
  });

  test('Tests a patch without a real handle', async function() {
    const res = await request(app).patch('/companies/ALKSDJF');
    expect(res.statusCode).toBe(404);
  });
});

/** Tests deleting a company by handle*/

describe('deleting a company by their handle /companies/:handle', async function() {
  test('Tests deleting a specific company', async function() {
    const res = await request(app).delete('/companies/BEEF');
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual({ message: 'Company delete' });
  });

  test('Tests a delete without a real handle', async function() {
    const res = await request(app).delete('/companies/ALKSDJF');
    expect(res.statusCode).toBe(404);
  });
});
