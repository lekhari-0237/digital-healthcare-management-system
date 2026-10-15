const mongoose = require('mongoose');

const diagnosticTestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add test name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please add test category']
    },
    description: {
      type: String,
      required: [true, 'Please add test description']
    },
    price: {
      type: Number,
      required: [true, 'Please add test price']
    },
    sampleType: {
      type: String,
      default: 'Blood'
    },
    preparation: {
      type: String,
      default: 'Fasting for 8-10 hours required'
    },
    reportTime: {
      type: String,
      default: '24 Hours'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('DiagnosticTest', diagnosticTestSchema);
