const mongoose = require('mongoose');

if (process.env.USE_MOCK_DB === 'true') {
  module.exports = require('../utils/mockDb').Student;
} else {
  const studentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    studentEmail: { type: String, required: true },
    studentPhone: { type: String, required: true },
    parentName: { type: String, required: true },
    parentEmail: { type: String, required: true },
    parentPhone: { type: String, required: true },
    qrCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('Student', studentSchema);
}
