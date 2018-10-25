process.env.NODE_ENV = 'test';
const db = require('../../db');
const app = require('../../app');

const sqlForPartialUpdate = require('../../helpers/partialUpdate');

beforeEach(async function() {
  //seed with some data
  await db.query(
    `INSERT INTO companies (handle, name, num_employees, description, logo_url)
    VALUES ('BEEF', 'Andrews Hot Dogs', '3', 'not beef hot dogs', 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg')`
  );
});

afterEach(async function() {
  await db.query('DELETE FROM companies');
});

afterAll(async function() {
  await db.end();
});

describe('partialUpdate()', () => {
  it('should generate a proper partial update query with just 1 field', function() {
    expect(
      sqlForPartialUpdate(
        'companies',
        { name: 'andrews beef', num_employees: 1 },
        'handle',
        'BEEF'
      )
    ).toEqual({
      query:
        'UPDATE companies SET name=$1, num_employees=$2 WHERE handle=$3 RETURNING *',
      values: ['andrews beef', 1, 'BEEF']
    });
  });
});

describe('partialUpdate()', () => {
  it('should skip "_" field', function() {
    expect(
      sqlForPartialUpdate(
        'companies',
        { name: 'andrews beef', _num_employees: 1 },
        'handle',
        'BEEF'
      )
    ).toEqual({
      query: 'UPDATE companies SET name=$1 WHERE handle=$2 RETURNING *',
      values: ['andrews beef', 'BEEF']
    });
  });
});
