const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔹 Ensure you have JWT_SECRET in your .env file, e.g.:
// JWT_SECRET=mysecretkey

// ==========================
// 🔹 SIGNUP ROUTE
// ==========================
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  body('role').optional()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password, role } = req.body;

    // 🔹 Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // 🔹 Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 🔹 Create and save user
    user = new User({ name, email, password: hash, role });
    await user.save();

    // 🔹 Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 🔹 Send token and user details
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

  } catch (err) {
    console.error('❌ Server error (Register):', err.message);
    res.status(500).send('Server error');
  }
});


// ==========================
// 🔹 LOGIN ROUTE
// ==========================
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;

    // 🔹 Check user existence
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // 🔹 Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // 🔹 Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 🔹 Send token and user info
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

  } catch (err) {
    console.error('❌ Server error (Login):', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
