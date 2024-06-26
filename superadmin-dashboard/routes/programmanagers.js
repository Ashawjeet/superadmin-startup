const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const ProgramManager = require('../models/ProgramManager');
const auth = require('../middleware/auth');

// @route   POST api/programmanagers
// @desc    Create a new program manager
router.post('/', auth, async (req, res) => {
  const { name, email, phone, username, password } = req.body;

  try {
    let pm = await ProgramManager.findOne({ email });
    if (pm) {
      return res.status(400).json({ msg: 'Program Manager already exists' });
    }

    pm = new ProgramManager({
      name,
      email,
      phone,
      username,
      password
    });

    const salt = await bcrypt.genSalt(10);
    pm.password = await bcrypt.hash(password, salt);

    await pm.save();
    res.json({ message: 'Program Manager created successfully', programManager: pm });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/programmanagers
// @desc    Get all program managers
router.get('/', auth, async (req, res) => {
  try {
    const programManagers = await ProgramManager.find();
    res.json(programManagers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
