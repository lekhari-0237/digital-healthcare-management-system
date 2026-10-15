const express = require('express');
const router = express.Router();
const { getPatientProfile, updatePatientProfile } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

router.get('/profile', protect, authorize('PATIENT'), getPatientProfile);
router.put('/profile', protect, authorize('PATIENT'), updatePatientProfile);

module.exports = router;
