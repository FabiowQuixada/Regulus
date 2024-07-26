const fs = require('fs');
const path = require('path');
const pathUtils = require('../util/path');
const Product = require('./product');

const cartsDatabasePath = path.join(pathUtils.root, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(product) {
        this.productList = [];
        this.totalPrice = 0;

        fs.readFile(cartsDatabasePath, (err, fileContent) => {
            let cart = {
                productList : [],
                totalPrice: 0
            };

            if (!err) {
                cart = JSON.parse(fileContent);
            }

            const existingProductIndex = cart.productList.findIndex(p => p.id == product.id);
            const existingProduct = cart.productList[existingProductIndex];

            if (existingProduct) {
                const updatedProduct = {...existingProductIndex};
                updatedProduct.qty += 1;
                cart.productList[existingProductIndex] = updatedProduct;
            } else {
                const newProduct = {
                    id : product.id,
                    qty : 1
                };
                cart.productList = [...cart.productList, newProduct];
            }

            cart.totalPrice += product.price;

            fs.writeFile(cartsDatabasePath, JSON.stringify(cart, null, 4), err2 => {
                console.log(err2);
            });
        });
    }
};
