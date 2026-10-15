const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
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
    appointmentDate: {
      type: Date,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    appointmentType: {
      type: String,
      enum: ['In-person', 'Online consultation'],
      default: 'In-person'
    },
    reason: {
      type: String,
      default: 'General Consultation'
    },
    status: {
      type: String,
      enum: [
        'PENDING_PAYMENT', 'PENDING_ADMIN_APPROVAL', 'CONFIRMED', 'CONSULTATION_STARTED', 'COMPLETED', 'CANCELLED',
        'Pending Payment', 'Pending Admin Approval', 'Confirmed', 'Consultation Started', 'Completed', 'Cancelled'
      ],
      default: 'PENDING_ADMIN_APPROVAL'
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
