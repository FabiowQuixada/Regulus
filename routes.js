const express = require('express');

const homeController     = require('./controllers/home');
const productsController = require('./controllers/products');
const errorsController   = require('./controllers/errors');
const cartController     = require('./controllers/cart');

const router = express.Router();

router.get('/', homeController.getHome);
router.get('/admin/add-product', productsController.getAddProduct);
router.post('/admin/add-product', productsController.postAddProduct);
router.get('/products', productsController.getProducts);
router.get('/products/:productId', productsController.getProduct);
router.get('/cart', cartController.getCart);
router.get(errorsController.get404);

module.exports = router;
