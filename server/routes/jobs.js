const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job'); // ensure file is named exactly 'Job.js' (case-sensitive in imports)


// GET /api/jobs?q=developer&location=... -> list + search
router.get('/', async (req, res) => {
  try {
    const { q, location, type } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;
    const jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// POST /api/jobs (employer only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') return res.status(403).json({ msg: 'Forbidden' });
    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
