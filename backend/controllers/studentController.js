const Student = require('../models/Student');
const QRCode = require('qrcode');
const { sendEmail } = require('../utils/email');

exports.registerStudent = async (req, res) => {
  try {
    const {
      studentName, studentId, studentEmail, studentPhone,
      parentName, parentEmail, parentPhone
    } = req.body;

    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }

    const qrData = JSON.stringify({ studentId });
    const qrCode = await QRCode.toDataURL(qrData);

    const student = new Student({
      studentName, studentId, studentEmail, studentPhone,
      parentName, parentEmail, parentPhone, qrCode
    });

    await student.save();

    await sendEmail(
      studentEmail,
      'Welcome to Student Warden Alert System',
      `Hello ${studentName}, your registration is complete. Your Student ID is ${studentId}.`
    );

    await sendEmail(
      parentEmail,
      'Student Warden Alert System Registration',
      `Hello ${parentName}, your ward ${studentName} has been registered.`
    );

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({}, '-qrCode');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
