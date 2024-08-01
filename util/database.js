const mysql = require('mysql2');
const Sequelize = require('sequelize');

const Product = require('../models/product');

const sequelize = new Sequelize('regulus', 'root', 'my-super-secret-password', {
    dialect : 'mysql'
});

module.exports = sequelize;
