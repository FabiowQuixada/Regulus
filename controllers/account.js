const Order = require('../models/order');

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

module.exports = {
    show,
};
