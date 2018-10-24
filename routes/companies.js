/** Routes for Jobly */

const express = require('express');

const Company = require('../models/company');

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

    console.log(router);

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
    console.log('hit post route');
    const company = await Company.create(req.body);
    console.log('company is ', company);
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

module.exports = router;
