const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('PATIENT'), createBooking);
router.get('/my', protect, authorize('PATIENT'), getMyBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, authorize('ADMIN'), updateBookingStatus);

module.exports = router;
