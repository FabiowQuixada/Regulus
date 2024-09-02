import crypto from 'crypto';
import User   from '../models/user.js';
import mailer from '../util/mailer.js';

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

const postLogin = async (req, res, next) => {
    const email    = req.body.email;
    const password = req.body.password;
    const user     = await User.findOne({ where: { email : email } });

    // TODO Encrypt password in the database;
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
};

const postLogout = (req, res, next) => {
    delete res.locals.userName;
    delete res.locals.isUserLoggedIn;

    // TODO Session isn't actually removed from the database;
    req.session.destroy((err) => {

        res.redirect('/');
    });
};

const postResetPassword = async (req, res, next) => {
    crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            console.log(err);
            res.redirect('/login');
            return;
        }
        const token = buffer.toString('hex');
        const inputEmail = req.body['recovery-email'];

        const user = await User.findOne({ where: { email: inputEmail }});

        if (!user) {
            console.log('user not found');
            res.redirect('/login');
            return;
        }

        user.resetPasswordToken = token;
        user.resetPasswordTokenExpDate = Date.now() + 3600;

        await user.save();

        mailer.send(inputEmail, 'Password Reset', `
            <p>
            Please click <a href="http://localhost:3000/reset-password/${token}">here</a> to reset your password.
            </p>
            `);

        res.redirect('/');
    });
};

const getResetPassword = async (req, res, next) => {
    const token = req.params.token;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordTokenExpDate: { $gt: Date.now() } // TODO Not working
    });

    res.render('auth/new-passord', {
        userId : user.id
    });
};

const postSaveNewPassword = async (req, res, next) => {
    const userId             = req.body['user-id'];
    const currentPassword    = req.body['current-password'];
    const newPassword        = req.body['new-password'];
    const confirmNewPassword = req.body['confirm-new-password'];

    if (newPassword !== confirmNewPassword) {
        redirect('/auth/new-password');
        return;
    }

    const user = await User.findByPk(userId);
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
};

export default {
    getSignup,
    postSignup,
    getLogin,
    postLogin,
    postLogout,
    postResetPassword,
    getResetPassword,
    postSaveNewPassword,
};
