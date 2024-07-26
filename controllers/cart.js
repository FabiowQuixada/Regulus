const Product = require('../models/product');
const Cart = require('../models/cart');

const addProduct = (req, res, next) => {
    Product.findById(
        req.body.productId,
        p => Cart.addProduct(p)
    );

    res.render('cart/cart', {
        pageTitle: 'Cart',
        path : '/cart'
    });
};

const getCart = (req, res, next) => {
    res.render('cart/cart', {
        pageTitle: 'Cart',
        path : '/cart'
    });
};

module.exports = {
    addProduct,
    getCart,
};
