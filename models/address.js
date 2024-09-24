import { sequelize, Sequelize } from '../util/database.js';

const Address = sequelize.define('address', {
    id : {
        type          : Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey    : true
    },
    name    : {
        type     : Sequelize.STRING,
        validate : {
            notEmpty : {
                msg: 'This field is mandatory'
            }
        }
    },
    street  : {
        type     : Sequelize.STRING,
        validate : {
            notEmpty : {
                msg: 'This field is mandatory'
            }
        }
    },
    city    : {
        type     : Sequelize.STRING,
        validate : {
            notEmpty : {
                msg: 'This field is mandatory'
            }
        }
    },
    state   : {
        type     : Sequelize.STRING,
        validate : {
            notEmpty : {
                msg: 'This field is mandatory'
            }
        }
    },
    zip     : {
        type     : Sequelize.STRING,
        validate : {
            notEmpty : {
                msg: 'This field is mandatory'
            }
        }
    },
    country : {
        type     : Sequelize.STRING,
        validate : {
            notEmpty : {
                msg: 'This field is mandatory'
            }
        }
    },
    isMain : {
        type     : Sequelize.BOOLEAN,
        validate : {
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
