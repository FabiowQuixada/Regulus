
const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path : '/admin/add-product'
    });
};

const postAddProduct = (req, res, next) => {
    const newProduct = new Product(req.body.title);

    newProduct.save();

    res.redirect('/');
};

const getProducts = (req, res, next) => {
    Product.fetchAll(productList => {
        res.render('shop/product-list', {
            productList,
            pageTitle: 'Shop',
            path : '/'
        });
    });
};

module.exports = {
    getAddProduct,
    postAddProduct,
    getProducts,
};
