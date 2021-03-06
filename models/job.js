const db = require('../db');
const sqlForPartialUpdate = require('../helpers/partialUpdate');
const Company = require('./company.js');

/** Job class */

class Job {
  static async create(title, salary, equity, company_handle) {
    // insert the message
    try {
      const result = await db.query(
        `INSERT INTO jobs (title, salary, equity, company_handle, date_posted)
        VALUES ($1, $2, $3, $4, current_timestamp)
        RETURNING id, title, salary, equity, company_handle, date_posted;`,
        [title, salary, equity, company_handle.toUpperCase()]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async search(search = '', minSalary = 0, minEquity = 0.0) {
    const result = await db.query(
      `SELECT title, company_handle
        FROM jobs
        WHERE (title ILIKE $1 OR company_handle ILIKE $1)
        AND salary >= $2 AND equity >= $3;`,
      ['%' + search + '%', minSalary, minEquity]
    );

    return { jobs: result.rows };
  }

  static async getById(id) {
    try {
      const result = await db.query(
        `SELECT id, title, salary, equity, company_handle, date_posted
      FROM jobs
      WHERE id = $1;`,
        [id]
      );
      console.log(result.rows);

      let job;
      if (result.rows.length > 0) {
        job = result.rows[0];
      } else {
        let err = new Error('Unable to find job');
        err.status = 400;
        throw err;
      }
      let companyHandle = result.rows[0].company_handle;
      console.log(companyHandle);

      const companyResult = await Company.getByHandle(companyHandle);

      job.company = companyResult;
      let restructure = { job };

      return restructure;
    } catch (err) {
      return err;
    }
  }

  // this route updates the job
  static async update(id, title, salary, equity, company_handle) {
    let queryObj = sqlForPartialUpdate(
      'jobs',
      {
        title,
        salary,
        equity,
        company_handle
      },
      'id',
      id
    );

    const result = await db.query(queryObj.query, queryObj.values);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      let err = new Error('Unable to find job');
      err.status = 404;
      throw err;
    }
  }

  static async deleteById(id) {
    const result = await db.query(
      `DELETE FROM jobs
      WHERE id = $1
      RETURNING id`,
      [id]
    );
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      let err = new Error('Unable to find job');
      err.status = 404;
      throw err;
    }
  }
}

module.exports = Job;
