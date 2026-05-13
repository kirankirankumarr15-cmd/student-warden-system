const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.WARDEN_EMAIL,
        pass: process.env.WARDEN_PASSWORD
      }
    });

    const mailOptions = {
        from: process.env.WARDEN_EMAIL,
        to,
        subject,
        text,
        html: html || undefined
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.response}`);
    return { success: true, info };
  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, error };
  }
};

module.exports = { sendEmail };
