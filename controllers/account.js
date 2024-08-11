const Order = require('../models/order');
const User = require('../models/user');

const show = (req, res, next) => {
    const userId = req.session.user.id;
    Order
        .findOne({
            where: { userId    : req.session.user.id },
            order: [[ 'createdAt', 'DESC' ]]
        })
        .then(lastOrder => {
            res.render('account/index', {
                lastOrder
            });
        });
};

const getOrders = (req, res, next) => {
    const userId = req.session.user ? req.session.user.id : null;

    if (userId) {
        let fetchedUser;
        User.findByPk(userId)
            .then(user => user.getOrders({include: ['products']}))
            .then(orderList => {
                res.render('account/order/index', {
                    orderList
                });
            });
    }
};

module.exports = {
    show,
    getOrders,
};
