const TestBooking = require('../models/TestBooking');
const DiagnosticTest = require('../models/DiagnosticTest');
const Report = require('../models/Report');
const Notification = require('../models/Notification');

// @desc    Create a diagnostic test booking (Initial status: PENDING_ADMIN_APPROVAL)
// @route   POST /api/test-bookings
// @access  Private (PATIENT)
const createBooking = async (req, res) => {
  try {
    const { testId, bookingDate, timeSlot, collectionMethod } = req.body;

    const test = await DiagnosticTest.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Diagnostic test not found' });
    }

    const booking = await TestBooking.create({
      patientId: req.user._id,
      testId,
      bookingDate: bookingDate || new Date(),
      timeSlot: timeSlot || '09:00 AM',
      collectionMethod: collectionMethod || 'At Diagnostic Center',
      status: 'PENDING_ADMIN_APPROVAL'
    });

    const populatedBooking = await TestBooking.findById(booking._id).populate('testId');

    res.status(201).json({
      success: true,
      message: 'Booking created. Please submit payment transaction ID for Admin approval.',
      data: populatedBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error creating test booking' });
  }
};

// @desc    Get patient's test bookings
// @route   GET /api/test-bookings/my
// @access  Private (PATIENT)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await TestBooking.find({ patientId: req.user._id })
      .populate('testId')
      .populate('paymentId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching test bookings' });
  }
};

// @desc    Get booking by ID
// @route   GET /api/test-bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await TestBooking.findById(req.params.id)
      .populate('testId')
      .populate('patientId', 'name email phone gender dateOfBirth address')
      .populate('paymentId');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (
      req.user.role === 'PATIENT' &&
      booking.patientId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching booking' });
  }
};

// @desc    Update booking status (Admin / Lab Staff)
// @route   PUT /api/test-bookings/:id/status
// @access  Private (ADMIN)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await TestBooking.findById(req.params.id).populate('testId');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Normalize status string
    let finalStatus = status || booking.status;
    if (typeof finalStatus === 'string') {
      const upper = finalStatus.toUpperCase().replace(/\s+/g, '_');
      if (['BOOKED', 'PENDING_ADMIN_APPROVAL', 'CONFIRMED', 'SAMPLE_COLLECTED', 'PROCESSING', 'REPORT_GENERATED', 'COMPLETED', 'CANCELLED'].includes(upper)) {
        finalStatus = upper;
      }
    }

    booking.status = finalStatus;
    await booking.save();

    const currentUpper = booking.status.toUpperCase().replace(/\s+/g, '_');

    // Create / Update Report entry when stage progresses
    let report = await Report.findOne({ testBookingId: booking._id });
    if (!report && ['SAMPLE_COLLECTED', 'PROCESSING', 'REPORT_GENERATED', 'COMPLETED'].includes(currentUpper)) {
      report = await Report.create({
        patientId: booking.patientId,
        testBookingId: booking._id,
        testName: booking.testId ? booking.testId.name : 'Diagnostic Test',
        status: ['REPORT_GENERATED', 'COMPLETED'].includes(currentUpper) ? 'AVAILABLE' : 'PROCESSING',
        reportData: [
          { parameter: 'Hemoglobin', result: '13.8', unit: 'g/dL', referenceRange: '12.0 - 16.0', status: 'Normal' },
          { parameter: 'Total Leucocyte Count (TLC)', result: '7,200', unit: '/cumm', referenceRange: '4,000 - 11,000', status: 'Normal' },
          { parameter: 'Platelet Count', result: '250,000', unit: '/cumm', referenceRange: '150,000 - 450,000', status: 'Normal' },
          { parameter: 'Packed Cell Volume (PCV)', result: '42.0', unit: '%', referenceRange: '40.0 - 50.0', status: 'Normal' },
          { parameter: 'RBC Count', result: '4.7', unit: 'mill/cumm', referenceRange: '4.0 - 5.5', status: 'Normal' }
        ],
        interpretation: 'Sample analyzed under certified laboratory standards. Normal limits recorded for academic project demonstration.'
      });
    } else if (report) {
      if (status === 'REPORT_GENERATED' || status === 'COMPLETED') {
        report.status = 'AVAILABLE';
        await report.save();
      }
    }

    // Send notification
    await Notification.create({
      userId: booking.patientId,
      title: `Diagnostic Status Update: ${booking.testId ? booking.testId.name : 'Diagnostic Test'}`,
      message: `Your booking status is updated to: ${booking.status}.`,
      type: 'TEST_BOOKING'
    });

    res.json({ success: true, message: 'Booking status updated', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating booking status' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus
};
