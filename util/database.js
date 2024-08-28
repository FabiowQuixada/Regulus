import fs        from 'fs';
import Sequelize from 'sequelize';
import path      from 'path';
import pathUtils from './path.js';


// TODO Save password somewhere else;
export const sequelize = new Sequelize('regulus', 'root', 'my-super-secret-password', {
    dialect : 'mysql',
    storage: './session.sqlite',
    logging: false,
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

const loadDatabaseShippingMethodData = () => {
    const ShippingMethod = require('../models/shipping-method');

    ShippingMethod.create({
        name               : 'Pick up in Store',
        cost               : 0,
        imagePath          : '',
        deliveryTimeInDays : 0
    });

    ShippingMethod.create({
        name               : 'Express Delivery',
        cost               : 15.00,
        imagePath          : '',
        deliveryTimeInDays : 5
    });
};

export default {
    sequelize,
    loadDatabaseProductData,
    loadDatabaseShippingMethodData,
};
