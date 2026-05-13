const mongoose = require('mongoose');

if (process.env.USE_MOCK_DB === 'true') {
  module.exports = require('../utils/mockDb').Attendance;
} else {
  const attendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['IN', 'OUT'], required: true },
    timestamp: { type: Date, default: Date.now },
    lateEntry: { type: Boolean, default: false }
  });

  module.exports = mongoose.model('Attendance', attendanceSchema);
}
