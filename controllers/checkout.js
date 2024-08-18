const User = require('../models/user');

// TODO Put in env variable;
const stripe = require('stripe')('sk_test_51Po8PdFDBwKaWQBpfjT7q57Tgjj3h2WIZyWdMYI0sAeasmfeL3cakDIlbl8NUruDRjli1jLOY59HPmkftl3bw5mj00htii0t7Y');

const show = (req, res, next) => {
    const userId = req.session.user ? req.session.user.id : 1;

    // TODO Add "else" clause to all conditions like this;
    if (userId) {
        let fetchedUser;
        let c;

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
            .then(cart => {
                c = cart;
                return cart.getProducts();
            })
            .then(productList => {
                return stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: productList.map(p => {
                        return {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: p.title,
                                },
                                unit_amount: p.price * 100,
                            },
                            quantity: 1,
                        };
                    }),
                    mode: 'payment',
                    success_url: req.protocol + '://' + req.get('host') + '/checkout?step=review',
                    cancel_url: req.protocol + '://' + req.get('host') + '/checkout?step=payment',
                });
            })
            .then(stripeSession => {
                res.render('checkout/index', {
                    currentStep : req.query.step || 'init',
                    stripeSessionId : stripeSession.id,
                    cart : c
                });
            })
            .catch( err => {
                console.log(err);
            });
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
