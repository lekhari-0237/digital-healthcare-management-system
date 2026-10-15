const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/status', protect, updateAppointmentStatus);
router.put('/:id/reschedule', protect, rescheduleAppointment);

module.exports = router;

