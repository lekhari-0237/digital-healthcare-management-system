const express = require('express');
const router = express.Router();
const {
  submitPayment,
  getMyPayments,
  getPaymentById,
  approvePayment,
  rejectPayment
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('PATIENT'), submitPayment);
router.get('/my', protect, authorize('PATIENT'), getMyPayments);
router.get('/:id', protect, getPaymentById);

// Admin review endpoints
router.put('/:id/approve', protect, authorize('ADMIN'), approvePayment);
router.put('/:id/reject', protect, authorize('ADMIN'), rejectPayment);

module.exports = router;
