import Product from '../models/product.js';
import Cart    from '../models/cart.js';
import User    from '../models/user.js';

const addProduct = (req, res, next) => {
    const productId = req.body.productId;
    let fectchedCart;
    let newQty = 1;

    // TODO Hardcoded ID
    const userId = req.session.user ? req.session.user.id : 1;

    if (userId) {
        let fetchedUser;

        User.findByPk(userId)
            .then(user => {
                fetchedUser = user;
                return user.getCart();
            })
            .then(cart => {
                if (!cart) {
                    return req.session.user.createCart();
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
            .catch(err =>
                console.log(err)
            );
    }
};

const removeProduct = (req, res, next) => {
    const productId = req.body.productId;
    const userId = req.session.user ? req.session.user.id : null;

    if (userId) {
        let fetchedUser;

        User.findByPk(userId)
            .then(user => {
                fetchedUser = user;
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
    }
};

const show = (req, res, next) => {
    // TODO
    const userId = req.session.user ? req.session.user.id : 1;

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
                return cart.getProducts();
            })
            .then(productList => {
            // TODO Pass cart as parameter instead
                res.render('cart/index', {
                    productList
                });})
            .catch( err => {console.log(err);});
    } else {
        res.render('cart/index', {
            productList : []
        });
    }
};

const emptyCart = () => {
    Cart.emptyCart()
        .then(() => {
            redirect('/cart');
        });
};

export default {
    addProduct,
    removeProduct,
    show,
    emptyCart,
};
