import Sequelize from 'sequelize';

// TODO Save password somewhere else;
const sequelize = new Sequelize('regulus', 'root', 'my-super-secret-password', {
    dialect : 'mysql',
    storage: './session.sqlite',
    logging: false,
});

export {
    sequelize,
    Sequelize
};
