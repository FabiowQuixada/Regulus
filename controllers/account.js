const User = require('../models/user');

const show = (req, res, next) => {
    const userId = req.session.user.id;

    User.findByPk(userId)
        .then(user => {
            res.render('account/index', {

            });
        });
};

module.exports = {
    show,
};
