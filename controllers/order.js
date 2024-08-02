const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const User = require('../models/user');

const place = (req, res, next) => {
    let fetchedUser;
    // TODO Replace "User.findByPk(1)" with req.user
    User
        .findByPk(1)
        .then(user => {
            fetchedUser = user;
            return user.getCart();
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
};

const getOrders = (req, res, next) => {
    User
        .findByPk(1)
        .then(user => user.getOrders({include: ['products']}))
        .then(orderList => {
            res.render('order/index', {
                orderList
            });
        });
};

const getOrder = (req, res, next) => {
    // TODO Replace "User.findByPk(1)" with req.user
    User
        .findByPk(1)
        .then(user => {
            return user.getCart();
        })
        .then(cart => {
            return cart.getProducts();
        })
        .then(productList => {
            // TODO Pass cart as parameter instead
            res.render('cart/cart', {
                productList
            });})
        .catch( err => {console.log(err);});
};

module.exports = {
    place,
    getOrders,
    getOrder,
};
