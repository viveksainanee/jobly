/** Routes for authorization */

const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');
const express = require('express');

const User = require('../models/user');

const router = new express.Router();

/** login: {username, password} => {token} */

router.post('/login', async function(req, res, next) {
  try {
    let { username, password } = req.body;
    if (await User.authenticate(username, password)) {
      let token = await User.createUserToken(username);
      return res.json({ token });
    } else {
      throw new Error('Invalid username/password');
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
