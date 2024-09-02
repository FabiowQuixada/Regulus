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
    password : Sequelize.STRING,
});

// TODO Improve this
User.prototype.getOrCreateCart = async function () {
    const cart = await this.getCart({ include: ['products'] });

    if (!cart) {
        return await this.createCart();
    }

    return cart;
};

export default User;
