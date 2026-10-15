const express = require('express');
const router = express.Router();
const {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest
} = require('../controllers/testController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getTests);
router.get('/:id', getTestById);
router.post('/', protect, authorize('ADMIN'), createTest);
router.put('/:id', protect, authorize('ADMIN'), updateTest);
router.delete('/:id', protect, authorize('ADMIN'), deleteTest);

module.exports = router;
