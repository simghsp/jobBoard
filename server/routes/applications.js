const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const mailer = require('../utils/mailer');
const path = require('path');

/**
 * ✅ POST /api/applications/upload
 * Simple resume upload (used from Home page "Upload Resume" button)
 */
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const resumeUrl = `${req.protocol}://${req.get('host')}/uploads/resumes/${req.file.filename}`;

    res.json({
      msg: 'Resume uploaded successfully',
      fileName: req.file.filename,
      resumeUrl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while uploading file' });
  }
});

/**
 * ✅ POST /api/applications/:jobId/apply
 * Candidate applies to a specific job
 */
router.post('/:jobId/apply', auth, upload.single('resume'), async (req, res) => {
  try {
    // Only candidates can apply
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ msg: 'Only candidates can apply' });
    }

    // Check if job exists
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Candidate info
    const candidate = await User.findById(req.user.id);

    // Resume handling
    const resumeUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/resumes/${req.file.filename}`
      : candidate.resume;

    // Create new application
    const application = new Application({
      job: job._id,
      candidate: candidate._id,
      coverLetter: req.body.coverLetter || '',
      resumeUrl
    });

    await application.save();

    // Optional: Send email notification to employer
    const employer = await User.findById(job.postedBy);
    if (employer && employer.email) {
      try {
        await mailer.sendMail({
          to: employer.email,
          subject: `New Application for ${job.title}`,
          text: `${candidate.fullName || candidate.name} applied for ${job.title}.\nResume: ${resumeUrl}`
        });
      } catch (emailErr) {
        console.warn('Email send failed:', emailErr.message);
      }
    }

    res.json({ msg: 'Application submitted successfully', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * ✅ GET /api/applications/candidate
 * Fetch all applications of the logged-in candidate
 */
router.get('/candidate', auth, async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const apps = await Application.find({ candidate: req.user.id }).populate('job');
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * ✅ GET /api/applications/employer/:jobId
 * Fetch all applications for a job posted by the logged-in employer
 */
router.get('/employer/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const apps = await Application.find({ job: job._id })
      .populate('candidate', 'fullName name email resume');

    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
