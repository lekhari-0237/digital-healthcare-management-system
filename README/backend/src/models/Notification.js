const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    title: {
      type: String,
      default: 'Notification'
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['APPOINTMENT', 'TEST_BOOKING', 'PAYMENT', 'REPORT', 'PRESCRIPTION', 'SYSTEM', 'DOCTOR_UNAVAILABLE'],
      default: 'SYSTEM'
    },
    suggestedSlots: [
      {
        date: { type: String },
        time: { type: String }
      }
    ],
    read: {
      type: Boolean,
      default: false
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to synchronize recipientId <-> userId and read <-> isRead for backward compatibility
notificationSchema.pre('save', function (next) {
  if (!this.userId && this.recipientId) {
    this.userId = this.recipientId;
  }
  if (!this.recipientId && this.userId) {
    this.recipientId = this.userId;
  }
  if (this.read !== undefined) {
    this.isRead = this.read;
  }
  if (this.isRead !== undefined) {
    this.read = this.isRead;
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
