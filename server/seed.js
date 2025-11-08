const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Job = require('./models/Job');


(async () => {
await connectDB();
await User.deleteMany();
await Job.deleteMany();


const employer = new User({ name: 'Demo Employer', email: 'employer@example.com', password: 'hashedpassword', role: 'employer' });
await employer.save();


const job1 = new Job({ title: 'Frontend Developer', company: 'Acme', location: 'Remote', type: 'Full-time', description: 'React dev', postedBy: employer._id });
await job1.save();
const job2 = new Job({ title: 'Backend Developer', company: 'Beta', location: 'Mumbai', type: 'Full-time', description: 'Node dev', postedBy: employer._id });
await job2.save();


console.log('Seeded');
process.exit(0);
})();