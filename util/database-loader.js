import fs        from 'fs';
import path      from 'path';
import pathUtils from './path.js';
import ShippingMethod from '../models/shipping-method.js';
import User           from '../models/user.js';
import Product        from '../models/product.js';

const loadUserData = async () => {
    const user = await User.findByPk(1);

    if (!user) {
        await User.create({
            name     : 'Fabiow',
            email    : 'ftquixada@gmail.com',
            password : '123'
        });
    }
};

const loadProductData = () => {
    fs.readFile(path.join(pathUtils.root, 'data', 'products.json'), (err, fileContent) => {

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

const loadShippingMethodData = () => {

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
    loadUserData,
    loadProductData,
    loadShippingMethodData,
};
