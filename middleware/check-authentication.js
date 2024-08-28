export default (req, res, next) => {
    if (!req.session.isUserLoggedIn) {
        res.redirect('/login');
        return;
    }
    next();
};
