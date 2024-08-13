const User = require('../models/user');

const getSignup = (req, res, next) => {
    res.render('auth/signup', {
        userInput   : {},
        fieldErrors : {},
    });
};

const postSignup = (req, res, next) => {
    User.create({
        email    : req.body.email,
        password : req.body.password
    });

    res.redirect('/account');
};

const getLogin = (req, res, next) => {
    res.render('auth/login', {
        userInput   : {},
        fieldErrors : {},
    });
};

const postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: { email : email } })
        .then(user => {
            // TODO Encrypt password in the databse;
            if (user && password === user.password) {
                req.session.save(err => {
                    req.session.isUserLoggedIn = true;
                    req.session.user = user;
                    res.redirect('/account');
                });
            } else {
                // TODO It doesn't work;
                res
                    .status(402)
                    .render('/auth/login', {
                        // userInput   : req.body,
                        fieldErrors : {
                            password: 'Incorrect e-mail or password.'
                        }
                    });

                return;
            }
        });
};

const postLogout = (req, res, next) => {
    delete res.locals.userName;
    delete res.locals.isUserLoggedIn;

    // TODO Session isn't actually removed from the database;
    req.session.destroy((err) => {

        res.redirect('/');
    });
};

const postResetPassword = (req, res, next) => {
    const crypto = require('crypto');

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            res.redirect('/login');
            return;
        }
        const token = buffer.toString('hex');
        const inputEmail = req.body['recovery-email'];

        User
            .findOne({ where: { email: inputEmail }})
            .then(user => {
                if (!user) {
                    console.log('user not found');
                    res.redirect('/login');
                    return;
                }

                user.resetPasswordToken = token;
                user.resetPasswordTokenExpDate = Date.now() + 3600;

                return user.save();
            })
            .then(user => {
                const mailer = require('../util/mailer');

                res.redirect('/');

                return mailer.send(inputEmail, 'Password Reset', `
                    <p>
                        Please click <a href="http://localhost:3000/reset-password/${token}">here</a> to reset your password.
                    </p>
                    `);
            })
            .catch(err2 => {
                console.log(err2);
                res.redirect('/login');
                return;
            });
    });
};

const getResetPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({
        resetPasswordToken: token,
        resetPasswordTokenExpDate: { $gt: Date.now() } // TODO Not working
    })
        .then(user => {
            res.render('auth/new-passord', {
                userId : user.id
            });

        });

};

const postSaveNewPassword = (req, res, next) => {
    const userId             = req.body['user-id'];
    const currentPassword    = req.body['current-password'];
    const newPassword        = req.body['new-password'];
    const confirmNewPassword = req.body['confirm-new-password'];

    if (newPassword !== confirmNewPassword) {
        redirect('/auth/new-password');
        return;
    }

    User.findByPk(userId)
        .then(user => {
            // TODO Encrypt password in the databse;
            if (user && currentPassword === user.password) {
                user.password = newPassword;
                user.resetPasswordToken = null;
                user.resetPasswordTokenExpDate = null;
                user.save();

                res.redirect('/');
            } else {
                res.redirect('/login');
            }
        });
};

module.exports = {
    getSignup,
    postSignup,
    getLogin,
    postLogin,
    postLogout,
    postResetPassword,
    getResetPassword,
    postSaveNewPassword,
};
