const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
title: { type: String, required: true },
company: String,
location: String,
salary: String,
type: String,
description: String,
requirements: [String],
postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Job', JobSchema);
