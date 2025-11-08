const mongoose = require('mongoose');
const ApplicationSchema = new mongoose.Schema({
job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
coverLetter: String,
resumeUrl: String,
status: { type: String, enum: ['submitted','reviewed','rejected','accepted'], default: 'submitted' },
appliedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Application', ApplicationSchema);