
const send = (to, subject, htmlContent) => {
    require('dotenv').config();

    const sgMail = require('@sendgrid/mail');
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

module.exports = {
    send
};
