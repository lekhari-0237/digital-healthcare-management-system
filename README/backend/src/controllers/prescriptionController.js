const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

// @desc    Get patient's prescriptions (or doctor's issued prescriptions)
// @route   GET /api/prescriptions/my
// @access  Private (PATIENT or DOCTOR)
const getMyPrescriptions = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'PATIENT') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'DOCTOR') {
      query.doctorId = req.user._id;
    }

    const prescriptions = await Prescription.find(query)
      .populate('doctorId', 'name email phone profileImage')
      .populate('patientId', 'name email phone gender dateOfBirth address')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching prescriptions' });
  }
};

// @desc    Get prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('doctorId', 'name email phone profileImage')
      .populate('patientId', 'name email phone gender dateOfBirth address')
      .populate('appointmentId');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    if (
      req.user.role === 'PATIENT' &&
      prescription.patientId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this prescription' });
    }

    res.json({ success: true, data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching prescription' });
  }
};

// @desc    Create prescription & Complete consultation (DOCTOR)
// @route   POST /api/prescriptions
// @access  Private (DOCTOR)
const createPrescription = async (req, res) => {
  try {
    const { appointmentId, patientId, diagnosis, notes, medicines, advice, followUpDate } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Map medicines array to ensure medicineName property matches schema
    const formattedMedicines = (medicines || []).map((m) => ({
      medicineName: m.medicineName || m.name || 'Prescribed Medicine',
      dosage: m.dosage || '1 Tablet',
      frequency: m.frequency || 'Twice Daily',
      duration: m.duration || '5 Days',
      instructions: m.instructions || 'After meals'
    }));

    // 1. Create Prescription document
    const prescription = await Prescription.create({
      patientId: patientId || appointment.patientId,
      doctorId: req.user._id,
      appointmentId,
      diagnosis,
      notes: notes || '',
      medicines: formattedMedicines,
      advice: advice || '',
      followUpDate: followUpDate || null
    });

    // 2. Mark Appointment as COMPLETED
    appointment.status = 'COMPLETED';
    await appointment.save();

    // 3. Send Notification to Patient
    await Notification.create({
      userId: appointment.patientId,
      title: 'Consultation Completed & Prescription Issued',
      message: `Dr. ${req.user.name} has completed your consultation and issued your digital prescription.`,
      type: 'PRESCRIPTION'
    });

    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate('doctorId', 'name email phone profileImage')
      .populate('patientId', 'name email phone gender dateOfBirth address');

    res.status(201).json({
      success: true,
      message: 'Prescription saved & consultation completed.',
      data: populatedPrescription
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error creating prescription' });
  }
};

module.exports = {
  getMyPrescriptions,
  getPrescriptionById,
  createPrescription
};
