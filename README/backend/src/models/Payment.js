const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TestBooking'
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Credit/Debit Card', 'Net Banking'],
      required: true
    },
    transactionId: {
      type: String,
      required: [true, 'Please provide a valid Transaction / Reference ID']
    },
    status: {
      type: String,
      enum: ['PENDING_ADMIN_APPROVAL', 'APPROVED', 'REJECTED', 'REFUNDED'],
      default: 'PENDING_ADMIN_APPROVAL'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: {
      type: Date
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    adminReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
