const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// @route   POST api/admins/login
// @desc    Authenticate admin and get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      admin: {
        id: admin.id
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, firstTimeLogin: admin.firstTimeLogin });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/admins/change-password
// @desc    Change admin password
router.post('/change-password', auth, async (req, res) => {
  const { newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  try {
    let admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    admin.firstTimeLogin = false;

    await admin.save();
    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

// @route   GET api/admins/me
// @desc    Get admin profile
router.get('/me', auth, async (req, res) => {
    try {
      const admin = await Admin.findById(req.admin.id).select('-password');
      res.json(admin);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  module.exports = router;
  