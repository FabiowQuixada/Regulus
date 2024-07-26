const fs = require('fs');
const path = require('path');
const pathUtils = require('../util/path');

const productsDatabasePath = path.join(pathUtils.root, 'data', 'products.json');

const getProductListFromFile = (cb) => {
    fs.readFile(productsDatabasePath, (err, fileContent) => {
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

            fs.writeFile(productsDatabasePath, JSON.stringify(productList), err2 => {
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
