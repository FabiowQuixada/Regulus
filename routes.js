import express from 'express';
import { body } from 'express-validator';

import homeController      from './controllers/home.js';
import productsController  from './controllers/products.js';
import errorsController    from './controllers/errors.js';
import cartController      from './controllers/cart.js';
import checkoutController  from './controllers/checkout.js';
import accountController   from './controllers/account.js';
import authController      from './controllers/auth.js';
import checkAuthentication from './middleware/check-authentication.js';
import { validateForm }    from './middleware/form.js';
import User                from './models/user.js';

const router = express.Router();

router.get('/', homeController.getHome);
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
    body('email', 'Invalid e-mail').isEmail(),
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

export default router;
