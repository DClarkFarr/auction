import nodemailer from "nodemailer";
import { env } from "../utils/environment.js";

const FROM_EMAIL = "no-reply@auction.danielsjunk.com";

function htmlToText(html) {
    return html.replace(/<[^>]*>?/gm, "");
}

let _transporter = null;

export default class MailService {
    static getTransporter() {
        if (_transporter) {
            return _transporter;
        }

        return (_transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: env("mail.email"),
                pass: env("mail.password"),
            },
        }));
    }
    static async sendMail(to, subject, html) {
        const res = await this.getTransporter().sendMail({
            from: FROM_EMAIL,
            to,
            subject,
            html,
            text: htmlToText(html),
        });

        return res;
    }

    static async sendForgotPasswordEmail(to, code) {
        const html = `
            <h1>Reset your password</h1>
            <p>Use the following code to reset your password:</p>
            <h2>${code}</h2>
        `;

        const res = await this.sendMail(to, "Password reset code", html);

        return res?.accepted?.length === 1;
    }
}
