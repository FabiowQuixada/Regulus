const express = require('express');

const homeController     = require('./controllers/home');
const productsController = require('./controllers/products');
const errorsController   = require('./controllers/errors');
const cartController     = require('./controllers/cart');
const orderController    = require('./controllers/order');
const authController  = require('./controllers/auth');

const router = express.Router();

router.get('/', homeController.getHome);
router.get('/products', productsController.getProducts);
router.get('/products/:productId', productsController.getProduct);

// Account;
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);

// Cart;
router.post('/cart/add-product', cartController.addProduct);
router.post('/cart/remove-product', cartController.removeProduct);
router.get('/cart', cartController.show);

// Order;
router.post('/order/place', orderController.place);
router.get('/orders', orderController.getOrders);
router.get('/order/:orderId', orderController.getOrder);

// Other;
router.get(errorsController.get404);

module.exports = router;
