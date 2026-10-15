const express = require('express');
const router = express.Router();
const {
  getPatientNotifications,
  markPatientNotificationRead
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getPatientNotifications);
router.put('/:id/read', markPatientNotificationRead);

module.exports = router;
