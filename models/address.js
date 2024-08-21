const Sequelize = require('sequelize');
const sequelize = require('../util/database').sequelize;

const Address = sequelize.define('address', {
    id : {
        type          : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull     : false,
        primaryKey    : true
    },
    name    : {
        type      : Sequelize.STRING,
        allowNull : false,
        notEmpty  : true,
    },
    street  : {
        type      : Sequelize.STRING,
        allowNull : false,
        notEmpty  : true,
    },
    city    : {
        type      : Sequelize.STRING,
        allowNull : false,
        notEmpty  : true,
    },
    state   : {
        type      : Sequelize.STRING,
        allowNull : false,
        notEmpty  : true,
    },
    zip     : {
        type      : Sequelize.STRING,
        allowNull : false,
        notEmpty  : true,
    },
    country : {
        type      : Sequelize.STRING,
        allowNull : false,
        notEmpty  : true,
    },
    isMain  :  Sequelize.BOOLEAN
});

module.exports = Address;
