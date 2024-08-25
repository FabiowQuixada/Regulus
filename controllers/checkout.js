const { Op } = require('sequelize');

const Address        = require('../models/address');
const ShippingMethod = require('../models/shipping-method');
const User           = require('../models/user');

// TODO Put in env variable;
const stripe = require('stripe')('sk_test_51Po8PdFDBwKaWQBpfjT7q57Tgjj3h2WIZyWdMYI0sAeasmfeL3cakDIlbl8NUruDRjli1jLOY59HPmkftl3bw5mj00htii0t7Y');

const show = (req, res, next) => {

    const productList = req.session.user.cart.products;
    if (productList.length == 0) {
        // throw new Error('Cart is empty');
        res.redirect('/cart');
        return;
    }

    let stpSession;

    stripe.checkout.sessions
        .create({
            payment_method_types: ['card'],
            line_items: productList.map(p => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: p.title,
                        },
                        unit_amount: Math.trunc(p.price * 100),
                    },
                    quantity: 1,
                };
            }),
            mode: 'payment',
            success_url: req.protocol + '://' + req.get('host') + '/checkout?step=review',
            cancel_url: req.protocol + '://' + req.get('host') + '/checkout?step=payment',
        })
        .then(stripeSession => {
            stpSession = stripeSession;
        })
        .then(() => {
            return ShippingMethod.findAll();
        })
        .then(shippingMethodList => {
            req.session.user
                .getAddresses({
                    order   : [ [ 'createdAt', 'DESC'] ]
                })
                .then(addressList => {
                    res.render('checkout/index', {
                        currentStep     : req.query.step || 'init',
                        stripeSessionId : stpSession.id,
                        cart            : req.session.user.cart,
                        // TODO Get directily from session user;
                        addressList     : addressList,
                        address : {},
                        shippingMethodList,
                    });
                })
                .catch(e => {
                    console.log(e);
                });
        })
        .catch( err => {
            console.log(err);
        });
};

const postSaveAddress = (req, res, next) => {
    const addressId    = req.body.addressId;
    const isNewAddress = addressId == -1;

    if (isNewAddress) {
        if (req.body.shouldSetAsMain == 'true') {
            Address.update(
                { isMain : false },
                { where : {
                    id : { [Op.not]: addressId }
                }}
            );
        }

        Address
            .create({
                name    : req.body.name,
                street  : req.body.street,
                city    : req.body.city,
                state   : req.body.state,
                zip     : req.body.zip,
                country : req.body.country,
                isMain  : req.body.shouldSetAsMain,
            })
            .then(newAdress => {
                req.session.user.cart.setShippingAddress(newAdress);

                if (req.body.shouldSaveAddress) {
                    req.session.user.addAddress(newAdress);
                }

                res.json({
                    success : true,
                    shippingAddressId : isNewAddress.id
                });
            }).catch((err) => {
                res.json({
                    success : false,
                });

                console.log(err);
            });

    } else {
        Address
            .findByPk(addressId)
            .then(address => {
                req.session.user.cart.setShippingAddress(address);

                res.json({
                    success : true,
                    shippingAddressId : address.id
                });
            }).catch((err) => {
                console.log(err);
                res.json({
                    success : false,
                });
            });
    }
};

const postSetShippingMethod = (req, res, next) => {
    const shippingMethodId = req.body.shippingMethodId;

    ShippingMethod
        .findByPk(shippingMethodId)
        .then(shippingMethod => {
            req.session.user.cart.setShippingMethod(shippingMethod);

            res.json({
                success : true,
            });
        }).catch((err) => {
            console.log(err);
            res.json({
                success : false,
            });
        });
};

const postSetBillingAddress = (req, res, next) => {
    const addressId    = req.body.addressId;
    const isNewAddress = addressId == -1;

    if (isNewAddress) {
        if (req.body.shouldSetAsMain == 'true') {
            Address.update(
                { isMain : false },
                { where : {
                    id : { [Op.not]: addressId }
                }}
            );
        }

        Address
            .create({
                name    : req.body.name,
                street  : req.body.street,
                city    : req.body.city,
                state   : req.body.state,
                zip     : req.body.zip,
                country : req.body.country,
                isMain  : req.body.shouldSetAsMain,
            })
            .then(newAdress => {
                req.session.user.cart.setBillingAddress(newAdress);

                if (req.body.shouldSaveAddress) {
                    req.session.user.addAddress(newAdress);
                }

                res.json({
                    success : true,
                });
            }).catch((err) => {
                res.json({
                    success : false,
                });
            });

    } else {
        Address
            .findByPk(addressId)
            .then(address => {
                req.session.user.cart.setBillingAddress(address);

                res.json({
                    success : true,
                });
            }).catch((err) => {
                console.log(err);
                res.json({
                    success : false,
                });
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
    postSaveAddress,
    postSetShippingMethod,
    postSetBillingAddress,
    placeOrder
};
