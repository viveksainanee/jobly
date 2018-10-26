process.env.NODE_ENV = 'test';
const db = require('../../db');
const app = require('../../app');

const Job = require('../../models/job');
const Company = require('../../models/company');

beforeEach(async function() {
  //seed with some data
  await db.query(
    `INSERT INTO companies (handle, name, num_employees, description, logo_url)
    VALUES ('BEEEF', 'Andrews Hot Dogs', '3', 'not beef hot dogs', 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg')`
  );

  await db.query(
    `INSERT INTO companies (handle, name, num_employees, description, logo_url)
    VALUES ('CHICKEN', 'Intel', '45345', 'We make vegan chips', 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg')`
  );

  await db.query(
    `INSERT INTO companies (handle, name, num_employees, description, logo_url)
    VALUES ('MYSP', 'MySpace', '1', '#2 social media site', 'https://image.freepik.com/free-icon/apple-logo_318-40184.jpg')`
  );

  await db.query(
    `INSERT INTO jobs (title, salary, equity, company_handle, date_posted)
    VALUES ('Andrews Assistant', 150000, 0.0, 'BEEEF', '2018-10-26T00:02:05.312Z');`
  );

  await db.query(
    `INSERT INTO jobs (id, title, salary, equity, company_handle, date_posted)
    VALUES (10000, 'Viveks Assistant', 150001, 0.4, 'CHICKEN', '2018-10-26T00:02:05.312Z');
    `
  );
});

afterEach(async function() {
  await db.query('DELETE FROM companies');
  await db.query('DELETE FROM jobs');
});

afterAll(async function() {
  await db.end();
});

/** create */
describe('test Job.create()', () => {
  it('should create a new job', async () => {
    let job = await Job.create('Superman', 4, 0.1, 'BEEEF');
    expect(job.title).toEqual('Superman');
  });
});

// /** Search */
describe('test Job.search()', () => {
  it('should search by title', async () => {
    expect(await Job.search('Vivek')).toEqual({
      jobs: [{ company_handle: 'CHICKEN', title: 'Viveks Assistant' }]
    });
  });

  it('should search for min salary', async () => {
    expect(await Job.search('', 150001)).toEqual({
      jobs: [{ company_handle: 'CHICKEN', title: 'Viveks Assistant' }]
    });
  });

  it('should search for min equity', async () => {
    expect(await Job.search('', 0, 0.4)).toEqual({
      jobs: [{ company_handle: 'CHICKEN', title: 'Viveks Assistant' }]
    });
  });
});

// /** Get By Id */

describe('test Job.getById()', async () => {
  it('should get a job by its Id', async () => {
    let job = await Job.getById(10000);
    expect(job.job.company.handle).toBe('CHICKEN');
  });

  //   it('it should raise error if there is no handle', async () => {
  //     try {
  //       await Company.getByHandle('FUNK');
  //     } catch (error) {
  //       expect(error).toEqual(error);
  //     }
  //   });
});

// /** Update */
// describe('test Company.update()', () => {
//   it('should update a company', async () => {
//     expect(await Company.update('BEEF', 'Chipotsss')).toEqual({
//       description: null,
//       handle: 'BEEF',
//       logo_url: null,
//       name: 'Chipotsss',
//       num_employees: null
//     });
//   });

//   it('it should raise error if there is no handle', async () => {
//     try {
//       await Company.update('FUNK');
//     } catch (error) {
//       expect(error).toEqual(error);
//     }
//   });
// });

// /** Delete By Handle */
// describe('test Company.deletByHandle()', () => {
//   it('should update a company', async () => {
//     expect(await Company.deleteByHandle('BEEF')).toEqual({ handle: 'BEEF' });
//   });

//   it('it should raise error if there is no handle', async () => {
//     try {
//       await Company.deleteByHandle('FUNK');
//     } catch (error) {
//       expect(error).toEqual(error);
//     }
//   });
// });
