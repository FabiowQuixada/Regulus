import { sequelize, Sequelize } from '../util/database.js';

const User = sequelize.define('user', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    name : Sequelize.STRING,
    email : Sequelize.STRING,
    resetPasswordToken : Sequelize.STRING,
    resetPasswordTokenExpDate : Sequelize.DATE,
    password : Sequelize.STRING
});

export default User;
