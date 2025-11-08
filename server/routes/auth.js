const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// Signup
router.post('/register', [
body('name').notEmpty(),
body('email').isEmail(),
body('password').isLength({ min: 6 }),
body('role').optional()
], async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
try {
const { name, email, password, role } = req.body;
let user = await User.findOne({ email });
if (user) return res.status(400).json({ msg: 'User already exists' });
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
user = new User({ name, email, password: hash, role });
await user.save();
const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token });
} catch (err) {
console.error(err);
res.status(500).send('Server error');
}
});


// Login
router.post('/login', [
body('email').isEmail(),
body('password').exists()
], async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token });
} catch (err) {
console.error(err);
res.status(500).send('Server error');
}
});


module.exports = router;