import { sequelize, Sequelize } from '../util/database.js';

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

export default Product;
