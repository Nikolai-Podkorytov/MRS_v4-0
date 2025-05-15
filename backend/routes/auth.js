const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, adminCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Check code if role is admin
    if (role === 'admin') {
      const expectedCode = process.env.ADMIN_SECRET_CODE;
      if (!adminCode || adminCode !== expectedCode) {
        return res.status(403).json({ message: 'Invalid admin secret code' });
      }
    }

    const newUser = new User({
      username,
      email,
      password, // passed as is—it will be hashed in pre('save')
      role: role || 'user'
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login — unchanged
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password does not match for:', email);
      console.log('Entered password:', password);
      console.log('Stored hash:', user.password);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Successful login:', email);

    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      role: user.role, // 👈 adding role
      username: user.username, // optional
      userId: user._id
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
