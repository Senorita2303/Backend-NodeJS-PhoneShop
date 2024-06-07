const nodeMailer = require("nodemailer");
import { env } from '~/config/environment';
// options are pass as arg from userController
const sendEmail = async (options) => {

    const transporter = nodeMailer.createTransport({
        //Simple Mail Transfer Protocol (SMTP) (write any thing but that make sense. its env fi)
        host: env.SMTP_HOST, // "smtp.gmail.com"
        port: Number(env.SMTP_PORT),  // 465,
        service: env.SMTP_SERVICE, // gmail
        secure: false,
        auth: {
            // this our email and pass wich one we use for sending mail
            user: env.SMTP_MAIL,
            pass: env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    // console.log(transporter);
    // console.log(mailOptions);
    await transporter.sendMail(mailOptions);
}
module.exports = sendEmail;