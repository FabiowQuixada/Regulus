const Order = require('../models/order');
const User = require('../models/user');
const Address = require('../models/address');

const show = (req, res, next) => {
    const userId = req.session.user.id;
    Order
        .findOne({
            where: { userId    : req.session.user.id },
            order: [[ 'createdAt', 'DESC' ]]
        })
        .then(lastOrder => {
            res.render('account/index', {
                lastOrder
            });
        });
};

const getOrders = (req, res, next) => {
    const userId = req.session.user ? req.session.user.id : null;

    if (userId) {
        let fetchedUser;
        User.findByPk(userId)
            .then(user => user.getOrders({
                include : ['products'],
                order   : [ [ 'createdAt', 'DESC'] ]
            }))
            .then(orderList => {
                res.render('account/order/index', {
                    orderList
                });
            });
    }
};

const getAddresses = (req, res, next) => {
    const userId = req.session.user ? req.session.user.id : null;

    if (userId) {
        let fetchedUser;
        User.findByPk(userId)
            .then(user => user.getAddresses({
                order   : [ [ 'createdAt', 'DESC'] ]
            }))
            .then(addressList => {
                res.render('account/address/list', {
                    addressList
                });
            });
    }
};

const getAddOrEditAddress = (req, res, next) => {
    const addressId = req.params.addressId;

    if (addressId) {
        Address.findByPk(addressId)
            .then(address => {
                res.render('account/address/add-or-edit', {
                    address,
                    formAction: '/account/addresses',
                    mode: 'edit'
                });
            });
    } else {
        res.render('account/address/add-or-edit', {
            address : {},
            formAction: '/account/addresses',
            mode: 'new'
        });
    }
};

const postSaveAddress = (req, res, next) => {
    const userId = req.session.user ? req.session.user.id : 1;


    // Address.create({
    //     street : req.body.street,
    //     city   : req.body.city,
    //     state  : req.body.state,
    //     zip    : req.body.zip,
    //     isMain : req.body.isMain
    // });

    // TODO Display success message to user;
    if (userId) {
        let fetchedUser;
        User
            .findByPk(userId)
            .then(user => {
                fetchedUser = user;
                return user;
            })
            .then(user => {
                user.createAddress({
                    name    : req.body.name,
                    street  : req.body.street,
                    city    : req.body.city,
                    state   : req.body.state,
                    zip     : req.body.zip,
                    country : req.body.country,
                    isMain  : req.body['is-main'] === 'on'
                })
                    .catch(e => {
                        console.log(e);
                    });
            })
            .then(() => {
                res.redirect('/account/addresses');
            })
            .catch(ee => {
                console.log(e);
            });
    }
};

module.exports = {
    show,
    getOrders,
    getAddresses,
    getAddOrEditAddress,
    postSaveAddress,
};
