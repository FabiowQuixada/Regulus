import { sequelize, Sequelize } from '../util/database.js';

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
    isMain : {
        type : Sequelize.BOOLEAN,
        validate: {
            // Maybe there is a slightly better way to mark all other addresses as not-main;
            async customValidator(isMain) {
                if (isMain) {
                    await Address.update(
                        { isMain: false },
                        { where: { userId: this.userId } }
                    );
                }
            }
        },
    }
});

Address.prototype.getFullAddress = function() {
    return [this.street, this.city, this.state, this.zip, this.country].join(', ');
};

export default Address;
