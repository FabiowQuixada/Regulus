const express = require('express');
const { body } = require('express-validator');

const homeController      = require('./controllers/home');
const productsController  = require('./controllers/products');
const errorsController    = require('./controllers/errors');
const cartController      = require('./controllers/cart');
const checkoutController  = require('./controllers/checkout');
const accountController   = require('./controllers/account');
const authController      = require('./controllers/auth');
const checkAuthentication = require('./middleware/check-authentication');
const { validateForm }    = require('./middleware/form');
const User                = require('./models/user');

const router = express.Router();

router.get('/', homeController.getHome);
router.get('/products', productsController.getProducts);
router.get('/products/:productId', productsController.getProduct);

// Authentication;
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset-password/:token', authController.getResetPassword);
router.post('/logout', authController.postLogout);

router.post(
    '/login',
    body('email', 'Invalid e-mail').isEmail(),
    validateForm('auth/login'),
    authController.postLogin
);

router.post(
    '/signup',
    body('email', 'Invalid e-mailooo').isEmail(),
    // TODO CHeck docs to make custom validation work;
    // .custom(value => {
    //     User.findOne({ where: { email : value } })
    //         .then(user => {
    //             if (user) {
    //                 return Promise.reject('E-mail is already registered');
    //             }

    //             return Promise.resolve();
    //         });
    // }),
    body('password', 'Invalid password').isLength({ min: 5 }),
    body('password-confirmation', 'Passwords must match').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error();
        }

        return true;
    }),
    validateForm('auth/signup'),
    authController.postSignup
);

router.post('/reset-password',
    body('recovery-email', 'Invalid e-mail').isEmail(),
    validateForm('auth/login'),
    authController.postResetPassword
);

router.post('/save-new-password',
    body('password', 'Invalid password').isLength({ min: 5 }),
    body('password-confirmation', 'Passwords must match').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error();
        }

        return true;
    }),
    authController.postSaveNewPassword
);

// Cart;
router.post('/cart/add-product', checkAuthentication, cartController.addProduct);
router.post('/cart/remove-product', checkAuthentication, cartController.removeProduct);
router.get('/cart', checkAuthentication, cartController.show);

// Checkout;
router.get('/checkout', checkAuthentication, checkoutController.show);
router.post('/checkout/select-shipping-address', checkAuthentication, checkoutController.postSaveAddress);
router.post('/checkout/set-shipping-method', checkAuthentication, checkoutController.postSetShippingMethod);
router.post('/checkout/set-billing-address', checkAuthentication, checkoutController.postSetBillingAddress);
router.post('/checkout/place-order', checkAuthentication, checkoutController.placeOrder);

// Account;
router.get('/account', checkAuthentication, accountController.show);
router.get('/account/orders', checkAuthentication, accountController.getOrders);
router.get('/account/addresses', checkAuthentication, accountController.getAddresses);
router.get('/account/addresses/new', checkAuthentication, accountController.getAddOrEditAddress);
router.get('/account/addresses/:addressId', checkAuthentication, accountController.getAddOrEditAddress);
router.post('/account/addresses', checkAuthentication, accountController.postSaveAddress);
router.post('/account/addresses/delete', checkAuthentication, accountController.deleteAddress);

// Other;
router.get('/500', errorsController.get500);
router.use(errorsController.get404);

module.exports = router;
