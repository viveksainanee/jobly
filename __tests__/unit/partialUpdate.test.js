process.env.NODE_ENV = 'test';
const db = require('../../db');
const app = require('../../app');

const sqlForPartialUpdate = require('../../helpers/partialUpdate');

beforeEach(async function() {
  //seed with some data
  await db.query(
    `INSERT INTO companies (handle, name, num_employees, description, logo_url)
    VALUES ('AAPL', 'Apple Computers', '30000', 'We make computers, not beef', 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg')`
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
        'AAPL'
      )
    ).toEqual({
      query:
        'UPDATE companies SET name=$1, num_employees=$2 WHERE handle=$3 RETURNING *',
      values: ['andrews beef', 1, 'AAPL']
    });
  });
});
