/** Routes for Jobs */

const express = require('express');

const Job = require('../models/job');

const { validate } = require('jsonschema');
const jobsPostSchema = require('../schemas/jobsPost.json');

const router = new express.Router();

/** Creates a new job from a POSTand returns
 * {job: jobData}
 */

router.post('/', async (req, res, next) => {
  try {
    const result = validate(req.body, jobsPostSchema);
    if (!result.valid) {
      let error = {};
      error.message = result.errors.map(error => error.stack);
      error.status = 400;
      return next(error);
    }
    let { title, salary, equity, company_handle } = req.body;

    const job = await Job.create(title, salary, equity, company_handle);
    res.json(job);
  } catch (err) {
    err.status = 400;
    return next(err);
  }
});

/** searchs for a job from a get and returns
 * {jobs: [job, ...]}
 */

router.get('/', async (req, res, next) => {
  try {
    parseInt(req.query.min_salary);
    parseInt(req.query.min_equity);
    if (req.query.min_equity < 0 || req.query.min_salary < 0) {
      let err = new Error('No negative numbers please');
      err.status = 400;
      throw err;
    }

    let { search, min_salary, min_equity } = req.query;
    const jobs = await Job.search(search, min_salary, min_equity);
    res.json(jobs);
  } catch (err) {
    err.status = 400;
    return next(err);
  }
});

/** Returns a single job found by id
 * {job: jobData}
 */

router.get('/:id', async (req, res, next) => {
  let { id } = req.params;

  const job = await Job.getById(id);
  return res.json({ job });
});

/** Updates a single job found by id
 * {job: jobData}
 */

router.patch('/:id', async (req, res, next) => {
  try {
    let { id } = req.params;
    let { title, salary, equity, company_handle } = req.body;

    const job = await Job.update(id, title, salary, equity, company_handle);
    res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** Deletes a single job found by id
 * { message: "Job deleted" }
 */

router.delete('/:id', async (req, res, next) => {
  try {
    let { id } = req.params;

    await Job.deleteById(id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
