const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');

const addProduct = (req, res, next) => {
    const productId = req.body.productId;
    let fectchedCart;
    let newQty = 1;

    // TODO Replace "User.findByPk(1)" with req.user
    User.findByPk(1)
        .then(user => {
            return user.getCart();
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

    User
        .findByPk(1)
        .then(user => {
            return user.getCart();
        })
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

const getCart = (req, res, next) => {
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
