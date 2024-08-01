const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    title : Sequelize.STRING,
    price : {
        type : Sequelize.DOUBLE,
        allowNull: false
    },
    imagePath : Sequelize.STRING,
    author: Sequelize.STRING,
    pageQty : Sequelize.INTEGER,
    country : Sequelize.STRING,
    language: Sequelize.STRING,
    year : Sequelize.INTEGER,
    moreInfoUrl : Sequelize.STRING
});

module.exports = Product;
