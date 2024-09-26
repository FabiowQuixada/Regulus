import Address        from '../models/address.js';
import ShippingMethod from '../models/shipping-method.js';
import User           from '../models/user.js';
import Stripe         from 'stripe';

const show = async (req, res, next) => {
    const stripe      = Stripe(process.env.STRIPE_SK);
    const productList = req.session.user.cart.products;
    if (productList.length == 0) {
        // throw new Error('Cart is empty');
        res.redirect('/cart');
        return;
    }

    const stripeSession = await stripe.checkout.sessions
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
        });

    const shippingMethodList = await ShippingMethod.findAll();
    const addressList        = await req.session.user
        .getAddresses({
            order   : [ [ 'createdAt', 'DESC'] ]
        });

    res.render('checkout/index', {
        currentStep     : req.query.step || 'init',
        stripeSessionId : stripeSession.id,
        cart            : req.session.user.cart,
        // TODO Get directily from session user;
        addressList     : addressList,
        address : {},
        shippingMethodList,
    });
};

const postSaveAddress = async (req, res, next) => {
    const addressId    = req.body.addressId;
    const isNewAddress = addressId == -1;

    if (isNewAddress) {
        const newAddress = await Address
            .create({
                name    : req.body.name,
                street  : req.body.street,
                city    : req.body.city,
                state   : req.body.state,
                zip     : req.body.zip,
                country : req.body.country,
                isMain  : req.body.shouldSetAsMain,
            });
        await req.session.user.cart.setShippingAddress(newAdress);

        if (req.body.shouldSaveAddress) {
            await req.session.user.addAddress(newAdress);
        }

        res.json({
            success : true,
            shippingAddressId : isNewAddress.id
        });

    } else {
        const address = await Address.findByPk(addressId);

        await req.session.user.cart.setShippingAddress(address);

        res.json({
            success : true,
            shippingAddressId : address.id
        });
    }
};

const postSetShippingMethod = async (req, res, next) => {
    const shippingMethod = await ShippingMethod.findByPk(req.body.shippingMethodId);

    if (shippingMethod) {
        await req.session.user.cart.setShippingMethod(shippingMethod);
    }

    res.json({
        success : !!shippingMethod,
    });
};

const postSetBillingAddress = async (req, res, next) => {
    const addressId    = req.body.addressId;
    const isNewAddress = addressId == -1;

    if (isNewAddress) {
        const newAddress = Address.create({
            name    : req.body.name,
            street  : req.body.street,
            city    : req.body.city,
            state   : req.body.state,
            zip     : req.body.zip,
            country : req.body.country,
            isMain  : req.body.shouldSetAsMain,
        });

        await req.session.user.cart.setBillingAddress(newAdress);

        if (req.body.shouldSaveAddress) {
            await req.session.user.addAddress(newAdress);
        }

        res.json({
            success : true,
        });

    } else {
        const address = await Address.findByPk(addressId);

        await req.session.user.cart.setBillingAddress(address);

        res.json({
            success : true,
        });

    }
};

const placeOrder = async (req, res, next) => {
    try {

        const userId = req.session.user ? req.session.user.id : null;

        if (userId) {
            const user  = await User.findByPk(userId);
            const cart  = await user.getOrCreateCart();
            const order = await user.createOrder();

            // TODO Is there a better way to do this?
            await order.addProducts(cart.products.map(product => {
                product.productLineItem = {
                    quantity: product.productLineItem.quantity
                };

                return product;
            }));

            await cart.destroy();

            res.redirect('/account/orders');
        }
    } catch (e) {
        console.log(e);
    }
};

export default {
    show,
    postSaveAddress,
    postSetShippingMethod,
    postSetBillingAddress,
    placeOrder
};
