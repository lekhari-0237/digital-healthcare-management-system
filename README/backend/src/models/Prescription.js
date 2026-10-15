const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true
    },
    diagnosis: {
      type: String,
      required: [true, 'Clinical diagnosis is required']
    },
    notes: {
      type: String,
      default: ''
    },
    medicines: [
      {
        medicineName: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        instructions: { type: String, default: 'After meals' }
      }
    ],
    advice: {
      type: String,
      default: ''
    },
    followUpDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
