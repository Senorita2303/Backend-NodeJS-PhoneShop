const nodeMailer = require('nodemailer');
import { env } from '~/config/environment';

async function nodeEmailer(args) {

    const transporter = nodeMailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: false,
        auth: {
            user: env.SMTP_MAIL,
            pass: env.SMTP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        to: args.to, // Email of the recipient
        from: args.from, // This will be our verified sender
        subject: args.subject, // the subject title of the email
        html: args.html,
        text: args.text,
        attachments: args.attachments,
    });

    console.log("Message sent: %s", info.messageId);
};

exports.nodeEmailer = async (args) => {
    if (env.NODE_ENV === 'development') {
        return new Promise.resolve();
    }
    else {
        return nodeEmailer(args);
    }
};