const fs = require('fs');
const path = require('path');
const pathUtils = require('../util/path');

const productsDatabase = path.join(pathUtils.root, 'data', 'products.json');

const getProductListFromFile = (cb) => {
    fs.readFile(productsDatabase, (err, fileContent) => {
        if (!err) {
            return cb(JSON.parse(fileContent));
        }

        return cb([]);
    });
};

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductListFromFile((productList) => {
            productList.push(this);

            fs.writeFile(productsDatabase, JSON.stringify(productList), err2 => {
                console.log(err2);
            });
        });
    }

    static fetchAll(cb) {
        getProductListFromFile(cb);
    }

    static findById(id, cb) {
        getProductListFromFile(productList => {
            const product = productList.find(p => p.id == id);
            cb(product);
        });
    }
};
