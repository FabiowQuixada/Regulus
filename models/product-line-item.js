import { sequelize, Sequelize } from '../util/database.js';

const ProductLineItem = sequelize.define('productLineItem', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});

export default ProductLineItem;
