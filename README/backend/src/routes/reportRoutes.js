const express = require('express');
const router = express.Router();
const {
  getMyReports,
  getReportById,
  createReport,
  updateReport
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, getMyReports);
router.get('/:id', protect, getReportById);
router.post('/', protect, authorize('ADMIN'), createReport);
router.put('/:id', protect, authorize('ADMIN'), updateReport);

module.exports = router;
