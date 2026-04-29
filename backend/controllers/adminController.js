const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register admin
// @route   POST /api/admin/register
// @access  Public (Should be protected or removed after first use)
const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const adminExists = await Admin.findOne({ username });

    if (adminExists) {
      return res.status(400).json({ success: false, error: 'Admin already exists' });
    }

    const admin = await Admin.create({
      username,
      password,
    });

    if (admin) {
      res.status(201).json({
        success: true,
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ success: false, error: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  if (admin) {
    res.json({
      success: true,
      _id: admin._id,
      username: admin.username,
    });
  } else {
    res.status(404).json({ success: false, error: 'Admin not found' });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
};
