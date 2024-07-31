const dbUtils = require('../util/database');

const db = dbUtils.poolPromisse;
const cartId = 1; // TODO
const emptyCartData = {
    productList : [],
    totalPrice  : 0
};

const updateCartTotal = cart => {
    cart.totalPrice = 0;

    // TODO Use .reduce()
    cart.productList.forEach(product => cart.totalPrice += product.price * product.qty);
};

module.exports = class Cart {
    static addProduct(product) {
        return this.get()
            .then(([dbCartList]) => {

                const cart     = this.dbToJson(dbCartList[0]);
                const existingProductIndex = cart.productList.findIndex(p => p.id == product.id);
                const existingProduct = cart.productList[existingProductIndex];

                if (existingProduct) {
                    const updatedProduct = {...existingProduct};

                    updatedProduct.qty += 1;

                    cart.productList[existingProductIndex] = updatedProduct;
                    cart.totalPrice += updatedProduct.price;
                } else {
                    const newProduct = {...product};

                    newProduct.qty = 1;

                    cart.productList.push(newProduct);
                    cart.totalPrice += newProduct.price;
                }

                updateCartTotal(cart);

                return this.update(cart);
            });
    }

    static removeProduct(productId) {
        return this.get()
            .then(([dbCart]) => {
                const cart   = this.dbToJson(dbCart[0]);
                const index  = cart.productList.findIndex(p => p.id == productId);

                cart.productList.splice(index, 1);

                updateCartTotal(cart);

                return this.update(cart);
            });
    }

    static get() {
        // TODO format cart object within this function and delete the "dbToJson" function;
        return db.execute(`SELECT * FROM carts WHERE id = ${cartId}`);
    }

    static update(cartData) {
        db.execute(`UPDATE carts SET cartData = '${JSON.stringify(cartData)}'`);

        return this.get();
    }

    static emptyCart() {
        // TODO In a real world example, cart should be deleted from the database;
        return update(emptyCartData);
    }

    // TODO Find a better way to do this
    static dbToJson(dbCart) {
        const cartData = JSON.parse(dbCart.cartData);
        const cart = {};
        cart.id = dbCart.id;
        cart.productList = cartData.productList;
        cart.totalPrice = cartData.totalPrice;

        return cart;
    }
};
