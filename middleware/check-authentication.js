module.exports = (req, res, next) => {
    if (!req.session.isUserLoggedIn) {
        res.redirect('/');
        return;
    }
    next();
};
