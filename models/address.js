const Sequelize = require('sequelize');
const sequelize = require('../util/database').sequelize;

const Address = sequelize.define('address', {
    id : {
        type          : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull     : false,
        primaryKey    : true
    },
    name    : Sequelize.STRING,
    street  : Sequelize.STRING,
    city    : Sequelize.STRING,
    state   : Sequelize.STRING,
    zip     : Sequelize.STRING,
    country : Sequelize.STRING,
    isMain  : Sequelize.BOOLEAN
});

module.exports = Address;
