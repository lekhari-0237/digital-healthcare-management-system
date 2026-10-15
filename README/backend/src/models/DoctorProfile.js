const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    specialization: {
      type: String,
      required: [true, 'Please specify doctor specialization']
    },
    qualification: {
      type: String,
      required: [true, 'Please specify doctor qualification']
    },
    experience: {
      type: Number,
      required: [true, 'Please specify years of experience']
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please specify consultation fee']
    },
    biography: {
      type: String,
      default: ''
    },
    availability: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    hospital: {
      type: String,
      default: 'HealthTrack Multi-Specialty Clinic'
    },
    rating: {
      type: Number,
      default: 4.8
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
