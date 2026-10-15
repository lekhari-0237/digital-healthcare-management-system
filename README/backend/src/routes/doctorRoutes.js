const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', protect, authorize('ADMIN'), createDoctor);
router.put('/:id', protect, updateDoctor);
router.delete('/:id', protect, authorize('ADMIN'), deleteDoctor);

module.exports = router;
