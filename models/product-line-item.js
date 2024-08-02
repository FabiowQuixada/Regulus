const Sequelize = require('sequelize');
const sequelize = require('../util/database').sequelize;

const ProductLineItem = sequelize.define('productLineItem', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = ProductLineItem;
