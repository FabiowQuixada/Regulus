const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const User = require('../models/user');

const place = (req, res, next) => {
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
                res.redirect('/orders');
            });
    }
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
    place,
    getOrders,
};
