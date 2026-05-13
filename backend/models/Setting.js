const mongoose = require('mongoose');

if (process.env.USE_MOCK_DB === 'true') {
  module.exports = require('../utils/mockDb').Setting;
} else {
  const settingSchema = new mongoose.Schema({
    weekdayCheckIn: { type: String, default: '06:00' },
    weekdayClosing: { type: String, default: '21:00' },
    weekendCheckIn: { type: String, default: '06:00' },
    weekendClosing: { type: String, default: '22:00' },
    reminderTime: { type: Number, default: 15 }, // minutes before closing
    graceTime: { type: Number, default: 10 } // minutes after closing allowed
  });

  module.exports = mongoose.model('Setting', settingSchema);
}
