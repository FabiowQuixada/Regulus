const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');

const addProduct = (req, res, next) => {
    const productId = req.body.productId;
    let fectchedCart;
    let newQty = 1;

    req.user.getCart()
        .then(cart => {
            if (!cart) {
                return req.user.createCart();
            }

            return cart;
        })
        .then(cart => {
            fectchedCart = cart;
            return cart.getProducts({ where: { id: productId }});
        })
        .then(productList => {
            let product;

            if (productList.length > 0) {
                product = productList[0];
            }

            if (product) {
                const oldQuantity = product.productLineItem.quantity;
                newQty = oldQuantity + 1;
                return product;
            }

            return Product.findByPk(productId);
        })
        .then(p => {
            return fectchedCart.addProduct(p, { through: { quantity: newQty }});
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

const removeProduct = (req, res, next) => {
    const productId = req.body.productId;

    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id : productId } });
        })
        .then(productList => {
            const product = productList[0];
            product.productLineItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        });
};

const show = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            if (!cart) {
                return req.user.createCart();
            }
            return cart.getProducts();
        })
        .then(productList => {
            // TODO Pass cart as parameter instead
            res.render('cart/index', {
                productList
            });})
        .catch( err => {console.log(err);});
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
    show,
    emptyCart,
};
