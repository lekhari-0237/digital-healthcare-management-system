const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPatients,
  togglePatientStatus,
  getAllAppointments,
  getAllBookings,
  getAllPayments,
  getAllReports,
  notifyDoctorUnavailable
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/patients', getPatients);
router.put('/patients/:id/status', togglePatientStatus);
router.get('/appointments', getAllAppointments);
router.post('/appointments/:id/notify-unavailable', notifyDoctorUnavailable);
router.get('/bookings', getAllBookings);
router.get('/payments', getAllPayments);
router.get('/reports', getAllReports);

module.exports = router;
