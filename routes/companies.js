/** Routes for Jobly */

const express = require('express');

const Company = require('../models/company');

router = express.Router();

/** Homepage: return handle and name for all companies. 
It allows for following query string parameters:
-search
-min_employees
-max_employees
 
**/

router.get('/', async (req, res) => {
  try {
    let { search, min_employees, max_employees } = req.query;

    const companies = await Company.search(
      search,
      min_employees,
      max_employees
    );
    res.json(companies);
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

module.exports = router;
