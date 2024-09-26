import nodemailer from "nodemailer";
import { env } from "../utils/environment.js";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: env("mail.email"),
        pass: env("mail.password"),
    },
});

const FROM_EMAIL = "no-reply@auction.danielsjunk.com";

function htmlToText(html) {
    return html.replace(/<[^>]*>?/gm, "");
}

export default class MailService {
    static async sendMail(to, subject, html) {
        const res = await transporter.sendMail({
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
