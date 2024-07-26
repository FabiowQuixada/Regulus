
const getCart = (req, res, next) => {
    res.render('cart/cart', {
        pageTitle: 'Cart',
        path : '/cart'
    });
};

module.exports = {
    getCart,
};
