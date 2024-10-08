import { sequelize, Sequelize } from '../util/database.js';
import path from 'path';
import currency from 'currency.js';

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
        allowNull: false,
        get() {
            return currency(this.getDataValue('price'));
        }
    },
    imagePath : Sequelize.STRING,
    author: Sequelize.STRING,
    pageQty : Sequelize.INTEGER,
    country : Sequelize.STRING,
    language: Sequelize.STRING,
    year : Sequelize.INTEGER,
    moreInfoUrl : Sequelize.STRING
});

Product.prototype.getImageUrl = function() {
    return path.join('public', this.imagePath);
};

export default Product;
