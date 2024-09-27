import Product from '../models/product.js';

const getProduct = async (req, res, next) => {
    const product = await Product.findByPk(req.params.productId);

    res.render('product/product-details', {
        product,
        pageTitle: 'Shop',
        path : '/products'
    });
};

export default {
    getProduct,
};
