const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const Notification = require('../models/Notification');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'healthtrack_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new patient
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, address } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password, phone)' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Always set role to PATIENT for public registration to prevent privilege escalation
    const user = await User.create({
      name,
      email,
      password,
      phone,
      dateOfBirth: dateOfBirth || null,
      gender: gender || 'Prefer not to say',
      address: address || '',
      role: 'PATIENT'
    });

    // Create welcome notification
    await Notification.create({
      userId: user._id,
      title: 'Welcome to HealthTrack!',
      message: 'Your account has been successfully created. Explore our diagnostic tests and expert doctors.',
      type: 'SYSTEM'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return res.status(403).json({ message: 'Your account has been deactivated. Please contact support.' });
      }

      let doctorProfile = null;
      if (user.role === 'DOCTOR') {
        doctorProfile = await DoctorProfile.findOne({ userId: user._id });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        doctorProfile,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let doctorProfile = null;
    if (user.role === 'DOCTOR') {
      doctorProfile = await DoctorProfile.findOne({ userId: user._id });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      doctorProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching user profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
