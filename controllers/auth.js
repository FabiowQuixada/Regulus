const Product = require('../models/product');
const User = require('../models/user');

const getSignup = (req, res, next) => {
    res.render('account/signup', {
    });
};

const postSignup = (req, res, next) => {
    const bcrypt = require('bcryptjs');
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirmation = req.body.passwordConfirmation;

    User.findOne({ where: { email } })
        .then(user => {
            if (user) {

            } else {
                // TODO Encrypt password;
                // bcrypt
                //     .hash(password, 12)
                // .then(encryptedPassword => {
                User.create({
                    email,
                    password : password
                });
                // });
            }
        });

    res.redirect('/');
};

const getLogin = (req, res, next) => {
    res.render('account/login', {
    });
};

const postLogin = (req, res, next) => {
    const bcrypt = require('bcryptjs');
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: { email : email } })
        .then(user => {
            // TODO Encrypt password in the databse;
            if (user && password === user.password) {
                req.session.save(err => {
                    req.session.isUserLoggedIn = true;
                    req.session.user = user;
                    res.redirect('/');
                });
            } else {
                res.redirect('/login');
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

module.exports = {
    getSignup,
    postSignup,
    getLogin,
    postLogin,
    postLogout,
};
