"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
/* eslint-disable @typescript-eslint/no-unused-vars */
const sendEmail = ({ to, token }) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = yield nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: 'naimurrhman53@gmail.com',
            pass: config_1.default.emailUserPass,
        },
    });
    console.log('Email transport created');
    // send mail with defined transport object
    const mailOptions = {
        from: 'naimurrhman53@gmail.com',
        to,
        subject: 'please login ',
        html: ` 
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Template</title>
      <style>
        body {
          background-color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        }
        .container {
          margin: 0 auto;
          padding: 20px 0 48px;
        }
        .logo {
          margin: 0 auto;
        }
        .paragraph {
          font-size: 16px;
          line-height: 26px;
        }
        .btn-container {
          text-align: center;
          color:#fff;
        }
        .button {
          padding: 12px 12px;
          background-color: #2563eb;
          border-radius: 3px;
          color: #fff;
          font-size: 16px;
          text-decoration: none;
          text-align: center;
          display: block;
        }
        .hr {
          border-color: #cccccc;
          margin: 20px 0;
        }
        .footer {
          color: #8898aa;
          font-size: 12px;
        }
        .logo-wrap{
            display:flex;
            justify-content:center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-wrap">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsF05WGOcmIm1X52kObH1we2qm-leDJx80tBtKf007-Q&s" width="150" height="150" alt="DigitalHippo" class="logo">
        </div>


        <p class="paragraph">Hi there,</p>
        <p class="paragraph">
          Welcome to DigitalHippo, the marketplace for
          high quality digital goods. Use the button below
          to Login.
        </p>
        <div class="btn-container">
          <a href="${config_1.default.frontendUrl}/verify?token=${token}" style="color:#fff" class="button">Verify</a>
        </div>
        <p class="paragraph">
          Best,<br>
          The DigitalHippo team
        </p>
        <hr class="hr">
        <p class="footer">
          If you did not request this email, you can
          safely ignore it.
        </p>
      </div>
    </body>
    </html>
    `,
    };
    // eslint-disable-next-line no-unused-vars
    yield transport.sendMail(Object.assign({}, mailOptions), (e, res) => {
        if (e) {
            console.log('somthing went wrong to send email');
        }
        else {
            console.log('Email sent successfully');
        }
    });
});
exports.default = sendEmail;
