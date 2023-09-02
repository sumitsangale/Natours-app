const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `sumit <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //sendGrid for production
      return 1;
    }

    //mailTrap for development
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_MAILTRAP_USERNAME,
        pass: process.env.EMAIL_MAILTRAP_PASSWORD
      }
    });
  }

  //actual send email
  async send(template, subject) {
    // 1) render html based on pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );

    // 2) define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html)
    };

    // 3)create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 min)'
    );
  }
};
