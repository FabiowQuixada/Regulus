const dbUtils = require('../util/database');

const db = dbUtils.poolPromisse;

module.exports = class Product {
    static fetchAll() {
        return db.execute('SELECT * from products');
    }

    static findById(id) {
        return db.execute(`SELECT * from products where id = ${id}`);
    }
};
