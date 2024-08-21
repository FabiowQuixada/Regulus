const Order = require('../models/order');
const User = require('../models/user');
const Address = require('../models/address');
const { Op } = require('sequelize');

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
    const userId = req.session.user ? req.session.user.id : 1;

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
            })
            .catch(err => {
                console.log(err);
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
    const addressId = req.body.id;

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
                const isMainAddress = req.body['is-main'] === 'on';

                if (addressId) {
                    Address.findByPk(addressId)
                        .then((address) => {
                            if (address) {
                                if (isMainAddress) {
                                    Address.update(
                                        { isMain : false },
                                        { where : {
                                            id : { [Op.not]: addressId }
                                        }}
                                    );
                                }

                                address.name    = req.body.name;
                                address.street  = req.body.street;
                                address.city    = req.body.city;
                                address.state   = req.body.state;
                                address.zip     = req.body.zip;
                                address.country = req.body.country;
                                address.isMain  = isMainAddress;
                                address.save();

                            }
                        });
                } else {
                    if (isMainAddress) {
                        Address.update(
                            { isMain : false },
                            { where : {
                                id : { [Op.not]: addressId }
                            }}
                        );
                    }

                    user.createAddress({
                        name    : req.body.name,
                        street  : req.body.street,
                        city    : req.body.city,
                        state   : req.body.state,
                        zip     : req.body.zip,
                        country : req.body.country,
                        isMain  : req.body['is-main'] === 'on'
                    });
                }
            })
            .then(() => {
                res.redirect('/account/addresses');
            })
            .catch(ee => {
                console.log(ee);
            });
    }
};

const deleteAddress = (req, res, next) => {
    const addressId = req.body['address-id'];

    Address
        .findByPk(addressId)
        .then(address => address.destroy())
        .then(() => {
            res.redirect('/account/addresses');
        });
};

module.exports = {
    show,
    getOrders,
    getAddresses,
    getAddOrEditAddress,
    postSaveAddress,
    deleteAddress,
};
