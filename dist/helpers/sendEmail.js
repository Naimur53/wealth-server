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
const sendEmail = ({ to }, { subject, html, text }) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = yield nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: config_1.default.emailUser,
            pass: config_1.default.emailUserPass,
        },
    });
    console.log('Email transport created');
    // send mail with defined transport object
    const mailOptions = {
        from: config_1.default.emailUser,
        to,
        subject,
        html,
        text,
    };
    // eslint-disable-next-line no-unused-vars
    yield transport.sendMail(Object.assign({}, mailOptions), (e, res) => {
        if (e) {
            console.log('something went wrong to send email');
        }
        else {
            console.log('Email sent successfully');
        }
    });
});
exports.default = sendEmail;
