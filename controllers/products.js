
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
    Product.fetchAll()
        .then(([productList]) => {
            res.render('shop/product-list', {
                productList,
                pageTitle: 'Shop',
                path : '/products'
            });
        })
        .catch((err) => { console.log(err); });
};

const getProduct = (req, res, next) => {
    const productId = req.params.productId;

    Product.findById(productId)
        .then(([productList, fieldData]) => {
            res.render('shop/product-details', {
                product : productList[0],
                pageTitle: 'Shop',
                path : '/products'
            });
        })
        .catch(err => { console.log(err);});
};

module.exports = {
    getAddProduct,
    postAddProduct,
    getProducts,
    getProduct,
};
