import Order   from '../models/order.js';
import User    from '../models/user.js';
import Address from '../models/address.js';
import { Op }  from 'sequelize';

const show = async (req, res, next) => {
    const userId    = req.session.user.id;
    const lastOrder = await Order.findOne({
        where: { userId    : req.session.user.id },
        order: [[ 'createdAt', 'DESC' ]]
    });

    res.render('account/index', {
        lastOrder
    });
};

const getOrders = async (req, res, next) => {
    const userId = req.session.user ? req.session.user.id : null;

    if (userId) {
        const user      = await User.findByPk(userId);
        const orderList = await user.getOrders({ // TODO Get order and products directly from user;
            include : ['products'],
            order   : [ [ 'createdAt', 'DESC'] ]
        });

        res.render('account/order/index', {
            orderList
        });
    }
};

// TODO For some reason this is called on /account/addresses/
const getAddresses = async (req, res, next) => {
    const userId = req.session.user ? req.session.user.id : 1;

    if (userId) {
        const user        = await User.findByPk(userId);
        const addressList = await  user.getAddresses({
            order   : [ [ 'createdAt', 'DESC'] ]
        });

        res.render('account/address/list', {
            addressList
        });
    }
};

const getAddOrEditAddress = async (req, res, next) => {
    const addressId = req.params.addressId;
    const address = await Address.findByPk(addressId);

    res.render('account/address/add-or-edit', {
        address : address || {},
        formAction: '/account/addresses',
        mode: address ? 'edit' : 'new'
    });
};

const postSaveAddress = async (req, res, next) => {
    const userId = req.session.user ? req.session.user.id : 1;
    const addressId = req.body.id;
    const isMainAddress = req.body['is-main'] === 'on';

    // TODO Display success message to user;
    if (userId) {
        const user = await User.findByPk(userId);


        if (addressId) {
            const address = await Address.findByPk(addressId);
            if (address) {
                // TODO Put validation in the model;
                if (isMainAddress) {
                    await Address.update(
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
                await address.save();
            }
        } else {
            if (isMainAddress) {
                await Address.update(
                    { isMain : false },
                    { where : {
                        id : { [Op.not]: addressId }
                    }}
                );
            }

            await user.createAddress({
                name    : req.body.name,
                street  : req.body.street,
                city    : req.body.city,
                state   : req.body.state,
                zip     : req.body.zip,
                country : req.body.country,
                isMain  : req.body['is-main'] === 'on'
            });
        }

        res.redirect('/account/addresses');
    }
};

const deleteAddress = async (req, res, next) => {
    const address = await Address.findByPk(req.body['address-id']);

    address.destroy();

    res.redirect('/account/addresses');
};

export default {
    show,
    getOrders,
    getAddresses,
    getAddOrEditAddress,
    postSaveAddress,
    deleteAddress,
};
