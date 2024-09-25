import Product from '../models/product.js';
import Cart    from '../models/cart.js';
import User    from '../models/user.js';

const addProduct = async (req, res, next) => {
    const productId = req.body.productId;

    // TODO Hardcoded ID
    const userId = req.session.user ? req.session.user.id : 1;

    if (userId) {
        const user        = await User.findByPk(userId);
        const cart        = await user.getOrCreateCart();
        const product     = cart.products.find(p => p.id == productId) || await Product.findByPk(productId);
        const newQty      = product.productLineItem && product.productLineItem.quantity ?
            product.productLineItem.quantity + 1 :
            1;

        await cart.addProduct(product, { through: { quantity: newQty }});

        res.redirect('/cart');
    }
};

const removeProduct = async (req, res, next) => {
    const productId = req.body.productId;
    const userId = req.session.user ? req.session.user.id : null;

    if (userId) {
        const user    = await User.findByPk(userId);
        const cart    = await user.getOrCreateCart();
        const product = cart.products.find(p => p.id === productId);

        product.productLineItem.destroy();

        res.redirect('/cart');
    }
};

const show = async (req, res, next) => {
    // TODO
    const userId = req.session.user ? req.session.user.id : 1;

    if (userId) {
        const user = await User.findByPk(userId);
        const cart = await user.getOrCreateCart();

        res.render('cart/index', {
            cart
        });
    } else {
        res.render('cart/index', {
            productList : []
        });
    }
};

const emptyCart = async () => {
    await Cart.emptyCart();

    redirect('/cart');
};

export default {
    addProduct,
    removeProduct,
    show,
    emptyCart,
};
