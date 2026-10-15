const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');

// @desc    Get all active doctors with profiles
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const { search, specialization, minExperience, maxFee } = req.query;

    let query = { role: 'DOCTOR', isActive: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const doctors = await User.find(query);
    const doctorIds = doctors.map(d => d._id);

    let profileQuery = { userId: { $in: doctorIds } };

    if (specialization && specialization !== 'All') {
      profileQuery.specialization = { $regex: specialization, $options: 'i' };
    }
    if (minExperience) {
      profileQuery.experience = { $gte: Number(minExperience) };
    }
    if (maxFee) {
      profileQuery.consultationFee = { $lte: Number(maxFee) };
    }

    const profiles = await DoctorProfile.find(profileQuery);
    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.userId.toString()] = p;
    });

    const result = doctors
      .filter(doc => profileMap[doc._id.toString()])
      .map(doc => ({
        _id: doc._id,
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        profileImage: doc.profileImage,
        isActive: doc.isActive,
        profile: profileMap[doc._id.toString()]
      }));

    res.json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching doctors' });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'DOCTOR') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const profile = await DoctorProfile.findOne({ userId: doctor._id });

    res.json({
      success: true,
      data: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        profileImage: doctor.profileImage,
        isActive: doctor.isActive,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching doctor details' });
  }
};

// @desc    Create doctor account (ADMIN ONLY)
// @route   POST /api/doctors
// @access  Private (ADMIN)
const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      qualification,
      experience,
      consultationFee,
      biography,
      availability,
      hospital,
      profileImage
    } = req.body;

    if (!name || !email || !password || !phone || !specialization || !qualification) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Name, Email, Password, Phone, Specialization, Qualification)'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'A user with this email address already exists' });
    }

    // Create User with role DOCTOR
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'DOCTOR',
      profileImage: profileImage || 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?auto=format&fit=crop&q=80&w=300'
    });

    // Create associated DoctorProfile
    const doctorProfile = await DoctorProfile.create({
      userId: user._id,
      specialization: specialization || 'General Physician',
      qualification: qualification || 'MBBS',
      experience: Number(experience) || 5,
      consultationFee: Number(consultationFee) || 500,
      biography: biography || '',
      availability: availability || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hospital: hospital || 'HealthTrack Multi-Specialty Hospital'
    });

    res.status(201).json({
      success: true,
      message: 'Doctor account created successfully by Admin',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: doctorProfile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error creating doctor account' });
  }
};

// @desc    Update doctor (Admin or Doctor self)
// @route   PUT /api/doctors/:id
// @access  Private (ADMIN or DOCTOR self)
const updateDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'DOCTOR') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (req.user.role !== 'ADMIN' && req.user._id.toString() !== doctor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this doctor profile' });
    }

    doctor.name = req.body.name || doctor.name;
    doctor.phone = req.body.phone || doctor.phone;
    if (req.body.profileImage) doctor.profileImage = req.body.profileImage;
    await doctor.save();

    let profile = await DoctorProfile.findOne({ userId: doctor._id });
    if (!profile) {
      profile = new DoctorProfile({ userId: doctor._id });
    }

    profile.specialization = req.body.specialization || profile.specialization;
    profile.qualification = req.body.qualification || profile.qualification;
    profile.experience = req.body.experience !== undefined ? req.body.experience : profile.experience;
    profile.consultationFee = req.body.consultationFee !== undefined ? req.body.consultationFee : profile.consultationFee;
    profile.biography = req.body.biography || profile.biography;
    profile.hospital = req.body.hospital || profile.hospital;
    if (req.body.availability) profile.availability = req.body.availability;

    await profile.save();

    res.json({
      success: true,
      message: 'Doctor profile updated',
      data: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        profileImage: doctor.profileImage,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating doctor' });
  }
};

// @desc    Deactivate doctor (Admin)
// @route   DELETE /api/doctors/:id
// @access  Private (ADMIN)
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    doctor.isActive = false;
    await doctor.save();

    res.json({ success: true, message: 'Doctor account deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error deactivating doctor' });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};
