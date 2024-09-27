import Product from '../models/product.js';

const getHome = async (req, res, next) => {
    const productList = await Product.findAll();

    res.render('product/product-list', {
        productList,
        pageTitle: 'Regulus',
        path : '/products'
    });
};

export default {
    getHome,
};
