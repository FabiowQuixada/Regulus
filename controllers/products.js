
const Product = require('../models/product');

const getProducts = (req, res, next) => {
    Product.findAll()
        .then((productList) => {
            res.render('product/product-list', {
                productList,
                pageTitle: 'Shop',
                path : '/products'
            });
        })
        .catch((err) => { console.log(err); });
};

const getProduct = (req, res, next) => {
    const productId = req.params.productId;

    Product.findByPk(productId)
        .then(product => {
            res.render('product/product-details', {
                product,
                pageTitle: 'Shop',
                path : '/products'
            });
        })
        .catch(err => { console.log(err);});
};

module.exports = {
    getProducts,
    getProduct,
};
