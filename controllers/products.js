
import Product from '../models/product.js';

const getProducts = async (req, res, next) => {
    const productList = await Product.findAll();

    res.render('product/product-list', {
        productList,
        pageTitle: 'Shop',
        path : '/products'
    });
};

const getProduct = async (req, res, next) => {
    const product = await Product.findByPk(req.params.productId);

    res.render('product/product-details', {
        product,
        pageTitle: 'Shop',
        path : '/products'
    });
};

export default {
    getProducts,
    getProduct,
};
