const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Setting = require('../models/Setting');
const { sendEmail } = require('../utils/email');

exports.scanQRCode = async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await Student.findOne({ studentId });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const lastAttendance = await Attendance.findOne({ student: student._id }).sort({ timestamp: -1 });
    let newStatus = 'IN';
    if (lastAttendance && lastAttendance.status === 'IN') {
      newStatus = 'OUT';
    }

    let isLate = false;
    if (newStatus === 'IN') {
      let settings = await Setting.findOne();
      if (!settings) settings = await new Setting().save();

      const now = new Date();
      const currentDay = now.getDay();
      const isWeekend = currentDay === 0 || currentDay === 6;
      
      const closingTimeStr = isWeekend ? settings.weekendClosing : settings.weekdayClosing;
      const [closeHour, closeMinute] = closingTimeStr.split(':').map(Number);
      
      const closingTime = new Date();
      closingTime.setHours(closeHour, closeMinute + settings.graceTime, 0, 0);

      if (now > closingTime) {
        isLate = true;
        // Send email to parent
        await sendEmail(
          student.parentEmail,
          'LATE ENTRY ALERT',
          `Your ward ${student.studentName} (${student.studentId}) has entered the hostel late at ${now.toLocaleString()}. Allowed entry time was ${closingTimeStr}.`
        );
      }
    }

    const attendance = new Attendance({
      student: student._id,
      status: newStatus,
      lateEntry: isLate
    });

    await attendance.save();
    
    const populatedAtt = await Attendance.findById(attendance._id).populate('student', 'studentName studentId');
    // req.io.emit is available because of our custom middleware in server.js
    if (req.io) {
      req.io.emit('attendanceUpdate', populatedAtt);
    }

    res.json({ message: `Successfully checked ${newStatus}`, attendance: populatedAtt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('student', 'studentName studentId').sort({ timestamp: -1 }).limit(100);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    
    const students = await Student.find({}, '_id');
    let insideCount = 0;
    
    for (const st of students) {
      const lastAtt = await Attendance.findOne({ student: st._id }).sort({ timestamp: -1 });
      if (lastAtt && lastAtt.status === 'IN') {
        insideCount++;
      }
    }
    
    res.json({
      totalStudents,
      insideCount,
      outsideCount: totalStudents - insideCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
