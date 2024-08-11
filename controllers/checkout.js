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

const placeOrder = (req, res, next) => {
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
                    return fetchedUser.createCart();
                }
                return cart;
            })
            .then(cart => cart.getProducts())
            .then(productList => {
                fetchedUser.createOrder()
                    .then(order => {
                    // TODO Is there a better way to do this?
                        order.addProducts(productList.map(product => {
                            product.productLineItem = {
                                quantity: product.productLineItem.quantity
                            };

                            return product;
                        }));
                    });
            })
            .then(() => fetchedUser.getCart())
            .then(cart => cart.destroy())
            .then(() => {
                res.redirect('/account/orders');
            });
    }
};

module.exports = {
    show,
    placeOrder
};
