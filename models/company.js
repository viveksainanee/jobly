const db = require('../db');
const sqlForPartialUpdate = require('../helpers/partialUpdate');

/** Company class for companies */

class Company {
  static async create({ handle, name, num_employees, description, logo_url }) {
    console.log('in create method');

    //check if the company exists
    const result = await db.query(
      'SELECT handle FROM companies WHERE handle = $1;',
      [handle]
    );
    let company = result.rows;
    console.log('company =', company);
    if (company.length === 0) {
      console.log('company is 0');
      // insert the message
      const result = await db.query(
        `INSERT INTO companies (handle, name, num_employees, description, logo_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING handle, name, num_employees, description, logo_url;`,
        [handle.toUpperCase(), name, num_employees, description, logo_url]
      );
      return result.rows[0];
    } else {
      let err = new Error('Company handle already exists');
      err.status = 400;
      throw err;
    }
  }

  static async search(handle = '', min = -1, max = 999999) {
    const result = await db.query(
      `SELECT handle, name
        FROM companies
        WHERE (handle ILIKE $1 OR name ILIKE $1)
        AND num_employees > $2 AND num_employees < $3;`,
      ['%' + handle + '%', min, max]
    );

    console.log('result is ', result);

    return { companies: result.rows };
  }

  static async getByHandle(handle) {
    const result = await db.query(
      `SELECT handle, name, num_employees, description, logo_url
        FROM companies
        WHERE handle = $1;`,
      [handle.toUpperCase()]
    );
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      let err = new Error('Unable to find company');
      err.status = 400;
      throw err;
    }
  }

  static async update(handle, name, num_employees, description, logo_url) {
    let queryObj = sqlForPartialUpdate(
      'companies',
      {
        handle,
        name,
        num_employees,
        description,
        logo_url
      },
      'handle',
      handle
    );

    const result = await db.query(queryObj.query, queryObj.values);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      let err = new Error('Unable to find company');
      err.status = 400;
      throw err;
    }
  }

  static async deleteByHandle(handle) {
    const result = await db.query(
      `DELETE FROM companies
      WHERE handle = $1
      RETURNING handle`,
      [handle.toUpperCase()]
    );
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      let err = new Error('Unable to find company');
      err.status = 400;
      throw err;
    }
  }
}

module.exports = Company;
