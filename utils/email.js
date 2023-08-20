const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1)Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_MAILTRAP_USERNAME,
      pass: process.env.EMAIL_MAILTRAP_PASSWORD
    }
  });

  // 2)Define the email options
  const mailOptions = {
    from: 'sumit <hello@sumit.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  console.log(transporter, mailOptions);

  // 3)Actually send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
