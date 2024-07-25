
const productList = [];

const getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path : '/admin/add-product'
    });
};

const postAddProduct = (req, res, next) => {
    productList.push({
        title : req.body.title
    });
    res.redirect('/');
};

const getProduct = (req, res, next) => {
    res.render('shop', {
        productList : productList,
        pageTitle: 'Shop',
        path : '/'
    });
};

module.exports = {
    getAddProduct,
    postAddProduct,
    getProduct,
};
