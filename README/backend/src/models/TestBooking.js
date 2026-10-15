const mongoose = require('mongoose');

const testBookingSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiagnosticTest',
      required: true
    },
    bookingDate: {
      type: Date,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    collectionMethod: {
      type: String,
      enum: ['At Diagnostic Center', 'Home Sample Collection'],
      default: 'At Diagnostic Center'
    },
    status: {
      type: String,
      enum: [
        'BOOKED', 'PENDING_ADMIN_APPROVAL', 'CONFIRMED', 'SAMPLE_COLLECTED', 'PROCESSING', 'REPORT_GENERATED', 'COMPLETED', 'CANCELLED',
        'Booked', 'Pending Admin Approval', 'Confirmed', 'Sample Collected', 'Processing', 'Report Generated', 'Completed', 'Cancelled'
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

module.exports = mongoose.model('TestBooking', testBookingSchema);
