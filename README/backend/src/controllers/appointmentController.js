const Appointment = require('../models/Appointment');
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const Notification = require('../models/Notification');

// @desc    Create doctor appointment (Initial state: PENDING_ADMIN_APPROVAL upon payment submission)
// @route   POST /api/appointments
// @access  Private (PATIENT)
const createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, appointmentType, reason } = req.body;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'DOCTOR') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      appointmentDate: appointmentDate || new Date(),
      timeSlot: timeSlot || '10:00 AM',
      appointmentType: appointmentType || 'In-person',
      reason: reason || 'General Consultation',
      status: 'PENDING_ADMIN_APPROVAL'
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctorId', 'name email phone profileImage');

    res.status(201).json({
      success: true,
      message: 'Appointment reserved. Please submit payment transaction ID for Admin approval.',
      data: populatedAppointment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error scheduling appointment' });
  }
};

// @desc    Get logged in patient's or doctor's appointments
// @route   GET /api/appointments/my
// @access  Private (PATIENT or DOCTOR)
const getMyAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'PATIENT') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'DOCTOR') {
      // DOCTOR MUST ONLY SEE CONFIRMED, CONSULTATION_STARTED, or COMPLETED appointments!
      query = {
        doctorId: req.user._id,
        status: { $in: ['CONFIRMED', 'CONSULTATION_STARTED', 'COMPLETED'] }
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email phone gender dateOfBirth address profileImage')
      .populate('doctorId', 'name email phone profileImage')
      .populate('paymentId')
      .sort({ appointmentDate: -1, createdAt: -1 });

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching appointments' });
  }
};

// @desc    Get appointment details by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email phone gender dateOfBirth address profileImage')
      .populate('doctorId', 'name email phone profileImage')
      .populate('paymentId');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching appointment details' });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (DOCTOR, ADMIN, PATIENT)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name')
      .populate('doctorId', 'name');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Normalize status string
    let finalStatus = status || appointment.status;
    if (typeof finalStatus === 'string') {
      const upper = finalStatus.toUpperCase().replace(/\s+/g, '_');
      if (['CONFIRMED', 'CANCELLED', 'COMPLETED', 'CONSULTATION_STARTED', 'PENDING_ADMIN_APPROVAL', 'PENDING_PAYMENT'].includes(upper)) {
        finalStatus = upper;
      }
    }

    appointment.status = finalStatus;
    await appointment.save();

    // Create notification
    await Notification.create({
      userId: appointment.patientId._id,
      title: `Appointment Status Updated`,
      message: `Your appointment with Dr. ${appointment.doctorId.name} is now: ${appointment.status}.`,
      type: 'APPOINTMENT'
    });

    res.json({ success: true, message: 'Appointment status updated', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating appointment status' });
  }
};

// @desc    Reschedule appointment date & time
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (PATIENT or ADMIN)
const rescheduleAppointment = async (req, res) => {
  try {
    const { date, time, appointmentDate, timeSlot } = req.body;
    const targetDate = date || appointmentDate;
    const targetTime = time || timeSlot;

    if (!targetDate || !targetTime) {
      return res.status(400).json({ success: false, message: 'Please provide both date and time slot' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.appointmentDate = new Date(targetDate);
    appointment.timeSlot = targetTime;
    appointment.status = 'CONFIRMED';
    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('doctorId', 'name email phone profileImage')
      .populate('patientId', 'name email phone');

    res.json({
      success: true,
      message: `Appointment rescheduled to ${targetDate} at ${targetTime}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error rescheduling appointment' });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment
};

