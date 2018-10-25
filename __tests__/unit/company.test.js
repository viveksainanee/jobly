process.env.NODE_ENV = 'test';
const db = require('../../db');
const app = require('../../app');

const Company = require('../../models/company');

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

/** create */
describe('test Company.create()', () => {
  it('should create a new company', async () => {
    expect(
      await Company.create({
        handle: 'CHIP',
        name: 'Chipotsss',
        num_employees: 30,
        description: 'Chipotle bowls and burritos',
        logo_url: 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg'
      })
    ).toEqual({
      description: 'Chipotle bowls and burritos',
      handle: 'CHIP',
      logo_url: 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg',
      name: 'Chipotsss',
      num_employees: 30
    });
  });

  it('it should raise error on duplicate handle', async () => {
    try {
      await Company.create({
        handle: 'BEEF',
        name: 'Chipotsss',
        num_employees: 30,
        description: 'Chipotle bowls and burritos',
        logo_url: 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg'
      });
    } catch (error) {
      expect(error).toEqual(error);
    }
  });
});

/** Search */
describe('test Company.search()', () => {
  it('should search for handle', async () => {
    expect(await Company.search('BEEF')).toEqual({
      companies: [{ handle: 'BEEF', name: 'Andrews Hot Dogs' }]
    });
  });

  it('should search for max employees of 3000', async () => {
    expect(await Company.search('', 0, 3000)).toEqual({
      companies: [
        { handle: 'BEEF', name: 'Andrews Hot Dogs' },
        { handle: 'MYSP', name: 'MySpace' }
      ]
    });
  });

  it('should search for min employee count of 5', async () => {
    expect(await Company.search('', 5)).toEqual({
      companies: [{ handle: 'INTC', name: 'Intel' }]
    });
  });
});

/** Get By Handle */
describe('test Company.getByHandle()', () => {
  it('should search for min employee count of 5', async () => {
    expect(await Company.getByHandle('BEEF')).toEqual({
      description: 'not beef hot dogs',
      handle: 'BEEF',
      logo_url: 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg',
      name: 'Andrews Hot Dogs',
      num_employees: 3
    });
  });

  it('it should raise error if there is no handle', async () => {
    try {
      await Company.getByHandle('FUNK');
    } catch (error) {
      expect(error).toEqual(error);
    }
  });
});

/** Update */
describe('test Company.update()', () => {
  it('should update a company', async () => {
    expect(await Company.update('BEEF', 'Chipotsss')).toEqual({
      description: null,
      handle: 'BEEF',
      logo_url: null,
      name: 'Chipotsss',
      num_employees: null
    });
  });

  it('it should raise error if there is no handle', async () => {
    try {
      await Company.update('FUNK');
    } catch (error) {
      expect(error).toEqual(error);
    }
  });
});

/** Delete By Handle */
describe('test Company.deletByHandle()', () => {
  it('should update a company', async () => {
    expect(await Company.deleteByHandle('BEEF')).toEqual({ handle: 'BEEF' });
  });

  it('it should raise error if there is no handle', async () => {
    try {
      await Company.deleteByHandle('FUNK');
    } catch (error) {
      expect(error).toEqual(error);
    }
  });
});
