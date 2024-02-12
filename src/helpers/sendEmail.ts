import nodemailer from 'nodemailer';
import config from '../config';
/* eslint-disable @typescript-eslint/no-unused-vars */
const sendEmail = async (
  { to, multi }: { to: string; multi?: string[] },
  { subject, html, text }: { subject: string; html: string; text?: string }
) => {
  // const transport = await nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: config.emailUser,
  //     pass: config.emailUserPass,
  //   },
  // });
  const transport = await nodemailer.createTransport({
    host: 'mail.privateemail.com', // or 'smtp.privateemail.com'
    port: 587, // or 465 for SSL
    secure: false, // true for 465, false for 587
    auth: {
      user: config.emailUser,
      pass: config.emailUserPass,
    },
    tls: {
      // Enable TLS encryption
      ciphers: 'SSLv3',
    },
  });
  console.log('Email transport created');
  // send mail with defined transport object
  const mailOptions = {
    from: config.emailUser,
    to,
    subject,
    html,
    text,
  };
  // eslint-disable-next-line no-unused-vars
  if (multi?.length) {
    console.log(multi);
    for (const recipient of multi) {
      const mailOptionsPer = {
        from: config.emailUser,
        to: recipient,
        subject,
        html,
        text,
      };

      try {
        // Send mail for each recipient
        await transport.sendMail({ ...mailOptionsPer });
        console.log(`Email sent successfully to ${recipient}`);
      } catch (error) {
        console.error(`Error sending email to ${recipient}:`, error);
      }
    }
  } else {
    await transport.sendMail({ ...mailOptions }, (e, b) => {
      console.log(e, b);
      if (e) {
        console.log('something went wrong to send email');
      } else {
        console.log('Email sent successfully');
      }
    });
  }
};
export default sendEmail;
