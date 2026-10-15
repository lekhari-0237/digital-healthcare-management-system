const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    testBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TestBooking',
      required: true
    },
    testName: {
      type: String,
      required: true
    },
    reportDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['PROCESSING', 'GENERATED', 'AVAILABLE', 'Processing', 'Generated', 'Available'],
      default: 'PROCESSING'
    },
    reportData: [
      {
        parameter: { type: String, required: true },
        result: { type: String, required: true },
        unit: { type: String, default: '' },
        referenceRange: { type: String, default: '' },
        status: { type: String, default: 'Normal' }
      }
    ],
    interpretation: {
      type: String,
      default: 'Diagnostic parameters analyzed within clinical reference limits. For academic demonstration purposes.'
    },
    fileUrl: {
      type: String,
      default: ''
    },
    generatedBy: {
      type: String,
      default: 'HealthTrack Diagnostic Pathology Lab'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Report', reportSchema);
