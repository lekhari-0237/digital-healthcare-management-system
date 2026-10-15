const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const TestBooking = require('../models/TestBooking');
const Notification = require('../models/Notification');

// @desc    Submit payment with manual Transaction ID (PATIENT)
// @route   POST /api/payments
// @access  Private (PATIENT)
const submitPayment = async (req, res) => {
  try {
    const { appointmentId, bookingId, amount, paymentMethod, transactionId } = req.body;

    if (!transactionId || !transactionId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter the transaction/reference ID provided by your payment app.'
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount.'
      });
    }

    // Create payment record with PENDING_ADMIN_APPROVAL status
    const payment = await Payment.create({
      patientId: req.user._id,
      appointmentId: appointmentId || null,
      bookingId: bookingId || null,
      amount: Number(amount),
      paymentMethod: paymentMethod || 'UPI',
      transactionId: transactionId.trim(),
      status: 'PENDING_ADMIN_APPROVAL',
      submittedAt: new Date()
    });

    // Update related Appointment or TestBooking to PENDING_ADMIN_APPROVAL
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentId: payment._id,
        status: 'PENDING_ADMIN_APPROVAL'
      });
    }

    if (bookingId) {
      await TestBooking.findByIdAndUpdate(bookingId, {
        paymentId: payment._id,
        status: 'PENDING_ADMIN_APPROVAL'
      });
    }

    // Create Notification for Patient
    await Notification.create({
      userId: req.user._id,
      title: 'Payment Submitted for Verification',
      message: `Your transaction ID (${transactionId}) of ₹${amount} has been submitted and is currently awaiting Admin approval.`,
      type: 'PAYMENT'
    });

    res.status(201).json({
      success: true,
      message: 'Payment submitted successfully. Awaiting admin approval.',
      data: payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error submitting payment' });
  }
};

// @desc    Get patient payment history (PATIENT)
// @route   GET /api/payments/my
// @access  Private (PATIENT)
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ patientId: req.user._id })
      .populate({
        path: 'bookingId',
        populate: { path: 'testId', select: 'name category price' }
      })
      .populate({
        path: 'appointmentId',
        populate: { path: 'doctorId', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching payment history' });
  }
};

// @desc    Get payment detail by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('patientId', 'name email phone')
      .populate({
        path: 'bookingId',
        populate: { path: 'testId' }
      })
      .populate({
        path: 'appointmentId',
        populate: { path: 'doctorId', select: 'name' }
      });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    if (
      req.user.role === 'PATIENT' &&
      payment.patientId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this payment' });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching payment detail' });
  }
};

// @desc    Approve Payment (ADMIN ONLY)
// @route   PUT /api/payments/:id/approve
// @access  Private (ADMIN)
const approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    if (payment.status === 'APPROVED') {
      return res.status(400).json({ success: false, message: 'Payment has already been approved' });
    }

    payment.status = 'APPROVED';
    payment.reviewedAt = new Date();
    payment.reviewedBy = req.user._id;
    await payment.save();

    // Confirm Doctor Appointment if linked
    if (payment.appointmentId) {
      const appointment = await Appointment.findByIdAndUpdate(
        payment.appointmentId,
        { status: 'CONFIRMED' },
        { new: true }
      ).populate('patientId doctorId');

      if (appointment) {
        // Patient Notification
        await Notification.create({
          userId: appointment.patientId._id,
          title: 'Payment Approved & Appointment Confirmed',
          message: `Your payment was approved by Admin. Your appointment with Dr. ${appointment.doctorId.name} is now CONFIRMED.`,
          type: 'APPOINTMENT'
        });

        // Doctor Notification (Now the doctor can see the appointment!)
        await Notification.create({
          userId: appointment.doctorId._id,
          title: 'New Confirmed Appointment',
          message: `Payment approved for ${appointment.patientId.name}'s appointment on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.timeSlot}.`,
          type: 'APPOINTMENT'
        });
      }
    }

    // Confirm Diagnostic Test Booking if linked
    if (payment.bookingId) {
      const booking = await TestBooking.findByIdAndUpdate(
        payment.bookingId,
        { status: 'CONFIRMED' },
        { new: true }
      ).populate('patientId testId');

      if (booking) {
        await Notification.create({
          userId: booking.patientId._id,
          title: 'Payment Approved & Diagnostic Booking Confirmed',
          message: `Your payment was approved by Admin. Your booking for ${booking.testId.name} is now CONFIRMED.`,
          type: 'TEST_BOOKING'
        });
      }
    }

    res.json({
      success: true,
      message: 'Payment approved successfully. Appointment/Booking is now CONFIRMED.',
      data: payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error approving payment' });
  }
};

// @desc    Reject Payment (ADMIN ONLY)
// @route   PUT /api/payments/:id/reject
// @access  Private (ADMIN)
const rejectPayment = async (req, res) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    payment.status = 'REJECTED';
    payment.reviewedAt = new Date();
    payment.reviewedBy = req.user._id;
    payment.adminReason = reason || 'Transaction ID could not be verified.';
    await payment.save();

    // Cancel related Appointment / Booking
    if (payment.appointmentId) {
      await Appointment.findByIdAndUpdate(payment.appointmentId, { status: 'CANCELLED' });
    }
    if (payment.bookingId) {
      await TestBooking.findByIdAndUpdate(payment.bookingId, { status: 'CANCELLED' });
    }

    // Notify Patient
    await Notification.create({
      userId: payment.patientId,
      title: 'Payment Rejected by Admin',
      message: `Your payment transaction ID (${payment.transactionId}) was rejected. Reason: ${payment.adminReason}`,
      type: 'PAYMENT'
    });

    res.json({
      success: true,
      message: 'Payment rejected.',
      data: payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error rejecting payment' });
  }
};

module.exports = {
  submitPayment,
  getMyPayments,
  getPaymentById,
  approvePayment,
  rejectPayment
};
