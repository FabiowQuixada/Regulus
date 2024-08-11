const User = require('../models/user');

const show = (req, res, next) => {
    const userId = req.session.user ? req.session.user.id : null;

    if (userId) {
        let fetchedUser;
        User.findByPk(userId)
            .then(user => {
                fetchedUser = user;
                return user.getCart();
            })
            .then(cart => {
                if (!cart) {
                    return req.user.createCart();
                }
                return cart;
            })
            .then(cart => {
                res.render('checkout/index', {
                    cart
                });})
            .catch( err => {console.log(err);});
    }
};

module.exports = {
    show,
};
