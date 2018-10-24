const db = require('../db');

/** Company class for companies */

class Company {
  // static async create({ from_username, to_username, body }) {
  //   try {
  //     //check if the user exists
  //     const result = await db.query(
  //       'SELECT password FROM users WHERE username = $1',
  //       [to_username]
  //     );
  //     let user = result.rows[0];

  //     if (user) {
  //       // insert the message
  //       const result = await db.query(
  //         `INSERT INTO messages (from_username, to_username, body, sent_at)
  //       VALUES ($1, $2, $3, current_timestamp)
  //       RETURNING id, from_username, to_username, body, sent_at`,
  //         [from_username, to_username, body]
  //       );
  //       return result.rows[0];
  //     }
  //   } catch (err) {
  //     return err;
  //   }
  // }

  static async search(handle = '', min = -1, max = 99999999999) {
    try {
      console.log('Entering search!! ENHANCE!');

      const result = await db.query(
        `SELECT handle, name 
        FROM companies
        WHERE (handle ILIKE $1 OR name ILIKE $1)
        AND num_employees > $2 AND num_employees < $3;`,
        ['AAPL', '0', '']
      );

      // const result = await db.query(
      //   `SELECT handle, name
      //   FROM companies
      //   WHERE (handle ILIKE $1 OR name ILIKE $1)
      //   AND num_employees > $2 AND num_employees < $3;`,
      //   [`'%${handle}%'`, min, max]
      // );
      console.log('result is ', result);

      return result.rows;
    } catch (err) {
      return err;
    }
  }
}

module.exports = Company;
