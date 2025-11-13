const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const mailer = require('../utils/mailer');



// POST /api/applications/:jobId/apply
router.post('/:jobId/apply', auth, upload.single('resume'), async (req, res) => {
try {
if (req.user.role !== 'candidate') return res.status(403).json({ msg: 'Only candidates can apply' });
const job = await Job.findById(req.params.jobId);
if (!job) return res.status(404).json({ msg: 'Job not found' });
const candidate = await User.findById(req.user.id);
const resumeUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : candidate.resume;
const application = new Application({ job: job._id, candidate: candidate._id, coverLetter: req.body.coverLetter || '', resumeUrl });
await application.save();
// Email notification to employer (best-effort)
const employer = await User.findById(job.postedBy);
if (employer && employer.email) {
await mailer.sendMail({
to: employer.email,
subject: `New application for ${job.title}`,
text: `${candidate.fullName} applied for ${job.title}. Resume: ${resumeUrl}`
});
}
res.json({ msg: 'Application submitted', application });
} catch (err) {
console.error(err);
res.status(500).send('Server error');
}
});


// GET candidate applications
router.get('/candidate', auth, async (req, res) => {
try {
if (req.user.role !== 'candidate') return res.status(403).json({ msg: 'Forbidden' });
const apps = await Application.find({ candidate: req.user.id }).populate('job');
res.json(apps);
} catch (err) { res.status(500).send('Server error'); }
});


// GET employer's job applications
router.get('/employer/:jobId', auth, async (req, res) => {
try {
const job = await Job.findById(req.params.jobId);
if (!job) return res.status(404).json({ msg: 'Job not found' });
if (job.postedBy.toString() !== req.user.id) return res.status(403).json({ msg: 'Forbidden' });
const apps = await Application.find({ job: job._id }).populate('candidate', 'name email resume');
res.json(apps);
} catch (err) { res.status(500).send('Server error'); }
});


module.exports = router;