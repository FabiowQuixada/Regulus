import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

const send = (to, subject, htmlContent) => {
    dotenv.config();

    const msg = {
        to,
        from    : 'ftquixada@gmail.com', // TODO Put in environment variable
        subject,
        html    : htmlContent
    };

    sgMail.setApiKey('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'); // TODO put in env file;

    sgMail
        .send(msg)
        .catch((error) => {
            console.error(error);
        });
};

export default {
    send
};
