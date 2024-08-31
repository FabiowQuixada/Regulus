import { sequelize, Sequelize } from '../util/database.js';

const Order = sequelize.define('order', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
});

export default Order;
