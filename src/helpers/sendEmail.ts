import nodemailer from 'nodemailer';
import config from '../config';
/* eslint-disable @typescript-eslint/no-unused-vars */
const sendEmail = async (
  { to }: { to: string },
  { subject, html, text }: { subject: string; html: string; text?: string }
) => {
  const transport = await nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailUserPass,
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
  await transport.sendMail({ ...mailOptions }, (e, res) => {
    if (e) {
      console.log('something went wrong to send email');
    } else {
      console.log('Email sent successfully');
    }
  });
};
export default sendEmail;
