const nodemailer = require('nodemailer');

require('dotenv').config();

async function sendEmail(mailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail(mailOptions);

  return info;
}

module.exports = sendEmail;