const User = require('../models/User');

// @desc    Get patient profile
// @route   GET /api/patients/profile
// @access  Private (PATIENT)
const getPatientProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching profile' });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/profile
// @access  Private (PATIENT)
const updatePatientProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    user.gender = req.body.gender || user.gender;
    user.address = req.body.address || user.address;
    user.profileImage = req.body.profileImage || user.profileImage;

    if (req.body.password && req.body.password.length >= 6) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      dateOfBirth: updatedUser.dateOfBirth,
      gender: updatedUser.gender,
      address: updatedUser.address,
      profileImage: updatedUser.profileImage
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating profile' });
  }
};

module.exports = {
  getPatientProfile,
  updatePatientProfile
};
