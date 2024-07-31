const mysql = require('mysql2');

const pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    database : 'regulus',
    password : 'my-super-secret-password' // TODO This is literally the password, geez
});
const poolPromisse = pool.promise();

const init = () => {
    const fs = require('fs');
    const path = require('path');
    const pathUtils = require('./path');

    // TODO Remove JSON file and upload database directly?
    fs.readFile(path.join(pathUtils.root, 'data', 'products.json'), (err, fileContent) => {
        let insertCommand = `INSERT INTO products (
                title, price, author, imagePath, country, language, pageQty, year, moreInfoUrl )
                VALUES `;

        if (err) {
            // TODO: Log the actual error
            console.log('database creation error');
        }

        const productList = JSON.parse(fileContent);

        const bookData = productList.map((product, i) => {
            return `(
                "${product.title || ''}",
                ${(Math.random() * (9999 - 1500) / 100).toFixed(2)}, 
                "${product.author || ''}",
                "${product.imageLink || ''}", 
                "${product.country || ''}",
                "${product.language || ''}",
                ${product.pageQty || '0'},
                ${product.year || '0'},
                "${product.moreInfoUrl || ''}")`;
        });

        insertCommand += bookData.join(', ');

        poolPromisse.query(insertCommand)
            .then(() => {})
            .catch(err2 => {console.log(err2);});
    });
};

module.exports = {
    init,
    poolPromisse
};
