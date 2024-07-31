const Product = require('../models/product');
const Cart = require('../models/cart');

const addProduct = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(([productList]) => {
            Cart.addProduct(productList[0])
                .then(([dbCart]) => {
                    const cart = Cart.dbToJson(dbCart[0]);

                    res.redirect('/cart');
                });
        })
        .catch(err => {
            console.log(err);
        });
};

const removeProduct = (req, res, next) => {
    Cart.removeProduct(req.body.productId)
        .then(() => {
            res.redirect('/cart');
        });
};

const getCart = (req, res, next) => {
    Cart.get()
        .then(([dbCart]) => {
            const cart = JSON.parse(dbCart[0].cartData);

            res.render('cart/cart', {
                cart
            });
        });
};

const emptyCart = () => {
    Cart.emptyCart()
        .then(() => {
            redirect('/cart');
        });
};

module.exports = {
    addProduct,
    removeProduct,
    getCart,
    emptyCart,
};
