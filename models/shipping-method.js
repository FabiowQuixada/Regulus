import Sequelize from 'sequelize';
import { sequelize } from '../util/database.js';

const ShippingMethod = sequelize.define('shipping-method', {
    id                 : {
        type          : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull     : false,
        primaryKey    : true
    },
    name               : Sequelize.STRING,
    imagePath          : Sequelize.STRING,
    cost               : Sequelize.DOUBLE,
    deliveryTimeInDays : Sequelize.INTEGER,
});

export default ShippingMethod;
