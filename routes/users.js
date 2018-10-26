/** Routes for USERS */

const express = require('express');

const User = require('../models/user');

const { validate } = require('jsonschema');
const usersPostSchema = require('../schemas/usersPost.json');

const router = new express.Router();

/** Creates a new users from a POST and returns
 * {user: user}
 */

router.post('/', async (req, res, next) => {
  try {
    const result = validate(req.body, usersPostSchema);
    if (!result.valid) {
      let error = {};
      error.message = result.errors.map(error => error.stack);
      error.status = 400;
      return next(error);
    }
    let {
      username,
      password,
      first_name,
      last_name,
      email,
      photo_url,
      is_admin
    } = req.body;

    const user = await User.create(
      username,
      password,
      first_name,
      last_name,
      email,
      photo_url,
      is_admin
    );

    res.json(user);
  } catch (err) {
    err.status = 400;
    return next(err);
  }
});

// /** gets a list of users
//  * {users: [{username, first_name, last_name, email}, ...]}
//  */

router.get('/', async (req, res, next) => {
  try {
    const users = await User.search();
    res.json(users);
  } catch (err) {
    err.status = 400;
    return next(err);
  }
});

// /** Returns a single user found by username
//  * {user: {username, first_name, last_name, email, photo_url}}
//  */

router.get('/:username', async (req, res, next) => {
  let { username } = req.params;
  const user = await user.getByUsername(username);
  return res.json(user);
});

// /** Updates a single user found by username
//  * {user: {username, first_name, last_name, email, photo_url}}
//  */

router.patch('/:username', async (req, res, next) => {
  try {
    let { username } = req.params;
    let {
      password,
      first_name,
      last_name,
      email,
      photo_url,
      is_admin
    } = req.body;

    const user = await User.update(
      username,
      password,
      first_name,
      last_name,
      email,
      photo_url,
      is_admin
    );
    res.json({ user });
  } catch (err) {
    return next(err);
  }
});

// /** Deletes a single user found by username
//  * { message: "User deleted" }
//  */

router.delete('/:username', async (req, res, next) => {
  try {
    let { username } = req.params;

    await User.deleteByUsername(username);
    res.json({ message: 'User deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
