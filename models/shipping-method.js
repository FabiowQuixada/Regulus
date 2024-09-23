import { sequelize, Sequelize } from '../util/database.js';
import currency from 'currency.js';

const ShippingMethod = sequelize.define('shipping-method', {
    id                 : {
        type          : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull     : false,
        primaryKey    : true
    },
    name               : Sequelize.STRING,
    imagePath          : Sequelize.STRING,
    cost               : {
        type: Sequelize.DOUBLE,
        get() {
            return currency(this.getDataValue('cost'));
        }
    },
    deliveryTimeInDays : Sequelize.INTEGER,
});

export default ShippingMethod;
