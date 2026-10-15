const express = require('express');
const router = express.Router();
const {
  getMyPrescriptions,
  getPrescriptionById,
  createPrescription
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, getMyPrescriptions);
router.get('/:id', protect, getPrescriptionById);
router.post('/', protect, authorize('DOCTOR'), createPrescription);

module.exports = router;
