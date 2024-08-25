const Sequelize = require('sequelize');
const sequelize = require('../util/database').sequelize;

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

module.exports = ShippingMethod;
