const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ email, passwordHash: hashed, name, role });
    await user.save();

    const token = jwt.sign({ id: user._id }, 'SECRET_KEY', { expiresIn: '1h' });
    res.status(201).json({ token, userId: user._id, role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/login', async (req, res) => {
  // Similar logic: find user, compare passwords, issue JWT
});

module.exports = router;
