import { sequelize, Sequelize } from '../util/database.js';
import currency                 from 'currency.js';

const Cart = sequelize.define('cart', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
});

Cart.prototype.getShppingCost = function () {
    if (this.shippingMethod) {
        totalPrice = totalPrice.add(this.shippingMethod.cost);
    }

    return null;
};


Cart.prototype.getTotalPrice = function () {
    let totalPrice = currency(0);

    this.products.forEach(product => {
        const productPrice = currency(product.price).multiply(product.productLineItem.quantity);
        totalPrice = totalPrice.add(productPrice);
    });

    if (this.shippingMethod) {
        totalPrice = totalPrice.add(this.shippingMethod.cost);
    }

    return totalPrice;
};

export default Cart;
