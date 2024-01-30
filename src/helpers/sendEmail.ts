import nodemailer from 'nodemailer';
import config from '../config';
/* eslint-disable @typescript-eslint/no-unused-vars */
const sendEmail = async (
  { to, multi }: { to: string; multi?: string[] },
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
  if (multi?.length) {
    for (const recipient of to) {
      const mailOptions = {
        from: config.emailUser,
        to: recipient,
        subject,
        html,
        text,
      };

      try {
        // Send mail for each recipient
        await transport.sendMail(mailOptions);
        console.log(`Email sent successfully to ${recipient}`);
      } catch (error) {
        console.error(`Error sending email to ${recipient}:`, error);
      }
    }
  } else {
    await transport.sendMail({ ...mailOptions }, e => {
      if (e) {
        console.log('something went wrong to send email');
      } else {
        console.log('Email sent successfully');
      }
    });
  }
};
export default sendEmail;
