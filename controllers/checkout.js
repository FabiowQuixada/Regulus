

const show = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            if (!cart) {
                return req.user.createCart();
            }
            return cart;
        })
        .then(cart => {
            res.render('checkout/index', {
                cart
            });})
        .catch( err => {console.log(err);});
};

module.exports = {
    show,
};
