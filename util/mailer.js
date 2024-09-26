import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

const send = (to, subject, htmlContent) => {
    dotenv.config();

    const msg = {
        to,
        from    : process.env.EMAIL_SENDER,
        subject,
        html    : htmlContent
    };

    sgMail.setApiKey(process.env.EMAIL_SENDGRID_SK);

    sgMail
        .send(msg)
        .catch((error) => {
            console.error(error);
        });
};

export default {
    send
};
