const nodemailer = require('nodemailer');
const debug = require('debug')('app:sendEmail');

const sendEmail = async (options) => {
  const { email, subject, message } = options;
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: 'noreply@shop.com',
    to: email,
    subject,
    text: message,
  });

  debug(`Message sent: ${info.messageId}`);
};

module.exports = sendEmail;
