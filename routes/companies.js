/** Routes for Jobly */

const express = require('express');

const Company = require('../models/company');

const { validate } = require('jsonschema');
const companiesPostSchema = require('../schemas/companiesPost.json');

const router = new express.Router();

/** Homepage: return handle and name for all companies. 
It allows for following query string parameters:
-search
-min_employees
-max_employees
returns
{companies: [companyData, ...]}


 
**/

router.get('/', async (req, res, next) => {
  try {
    let { search, min_employees, max_employees } = req.query;

    const companies = await Company.search(
      search,
      min_employees,
      max_employees
    );
    res.json(companies);
  } catch (err) {
    return next(err);
  }
});

/** Creates a new company and returns
 * {company: companyData}
 */

router.post('/', async (req, res, next) => {
  try {
    const result = validate(req.body, companiesPostSchema);
    if (!result.valid) {
      let error = {};
      error.message = result.errors.map(error => error.stack);
      error.status = 400;
      return next(error);
    }

    const company = await Company.create(req.body);
    res.json(company);
  } catch (err) {
    return next(err);
  }
});

/** Returns a single company found by handle
 * {company: companyData}
 */

router.get('/:handle', async (req, res, next) => {
  try {
    let { handle } = req.params;

    const company = await Company.getByHandle(handle);
    res.json({ company });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:handle', async (req, res, next) => {
  try {
    let { handle } = req.params;
    let { name, num_employees, description, logo_url } = req.body;

    const company = await Company.update(
      handle,
      name,
      num_employees,
      description,
      logo_url
    );
    res.json({ company });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:handle', async (req, res, next) => {
  try {
    let { handle } = req.params;

    await Company.deleteByHandle(handle);
    res.json({ message: 'Company delete' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
