const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/scan', attendanceController.scanQRCode);
router.get('/', attendanceController.getAttendance);
router.get('/stats', attendanceController.getStats);

module.exports = router;
