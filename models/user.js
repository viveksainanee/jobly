const db = require('../db');
const sqlForPartialUpdate = require('../helpers/partialUpdate');
const bcrypt = require('bcrypt');
const BCRYPT_WORK_ROUNDS = 10;
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

/** User class for users */

class User {
  static async create(
    username,
    password,
    first_name,
    last_name,
    email,
    photo_url,
    is_admin
  ) {
    try {
      let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_ROUNDS);
      const result = await db.query(
        `INSERT INTO users (username,
          password,
          first_name,
          last_name,
          email,
          photo_url,
          is_admin)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING username,
        password,
        first_name,
        last_name,
        email,
        photo_url,
        is_admin;`,
        [
          username,
          hashedPassword,
          first_name,
          last_name,
          email,
          photo_url,
          is_admin
        ]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  static async search() {
    const result = await db.query(
      `SELECT username, password, first_name, last_name, email, photo_url, is_admin
        FROM users;`
    );

    return { users: result.rows };
  }

  static async getByUsername(username) {
    try {
      const result = await db.query(
        `SELECT username, first_name, last_name, email, photo_url, is_admin
      FROM users
      WHERE username = $1;`,
        [username]
      );

      let user;
      if (result.rows.length > 0) {
        user = result.rows[0];
      } else {
        let err = new Error('Unable to find job');
        err.status = 400;
        throw err;
      }
      return user;
    } catch (err) {
      return err;
    }
  }

  //   // this route updates the user
  static async update(
    username,
    password,
    first_name,
    last_name,
    email,
    photo_url,
    is_admin
  ) {
    let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_ROUNDS);

    let queryObj = sqlForPartialUpdate(
      'users',
      {
        username,
        password: hashedPassword,
        first_name,
        last_name,
        email,
        photo_url,
        is_admin
      },
      'username',
      username
    );

    const result = await db.query(queryObj.query, queryObj.values);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      let err = new Error('Unable to find user');
      err.status = 404;
      throw err;
    }
  }

  static async deleteByUsername(username) {
    const result = await db.query(
      `DELETE FROM users
      WHERE username = $1
      RETURNING username`,
      [username]
    );
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      let err = new Error('Unable to find user');
      err.status = 404;
      throw err;
    }
  }

  static async authenticate(username, password) {
    const result = await db.query(
      'SELECT password FROM users WHERE username = $1',
      [username]
    );
    let user = result.rows[0];

    return user && (await bcrypt.compare(password, user.password));
  }

  static async createUserToken(username) {
    // need to get is admin
    const result = await db.query(
      'SELECT is_admin FROM users WHERE username = $1',
      [username]
    );

    let token = jwt.sign(
      { username, is_admin: result.rows[0].is_admin },
      SECRET,
      {}
    );
    return token;
  }
}

module.exports = User;
