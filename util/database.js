const fs = require('fs');
const Sequelize = require('sequelize');
const path = require('path');
const pathUtils = require('./path');


// TODO Save password somewhere else;
const sequelize = new Sequelize('regulus', 'root', 'my-super-secret-password', {
    dialect : 'mysql'
});

const loadDatabaseProductData = () => {
    fs.readFile(path.join(pathUtils.root, 'data', 'products.json'), (err, fileContent) => {
        const Product = require('../models/product');

        if (err) {
            console.log(err);
        }

        const productList = JSON.parse(fileContent);

        productList.map((product, i) => {
            // TODO Use build and execute in a single batch;
            Product.create({
                title       : product.title,
                price       : (Math.random() * (9999 - 1500) / 100).toFixed(2),
                imagePath   : product.imageLink,
                author      : product.author,
                pageQty     : product.pages,
                country     : product.country,
                language    : product.language,
                year        : product.year,
                moreInfoUrl : product.moreInfoUrl
            });
        });
    });
};

module.exports = {
    sequelize,
    loadDatabaseProductData
};
