const express = require('express');
const path = require('path');

const router = express.Router();
const rootDir = require('../util/path');
const adminData = require('./admin');

router.get('/', (req, res) => {
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));

    res.render('shop', {
        productList : adminData.productList,
        pageTitle: 'Shop',
        path : '/'
    });
});

module.exports = router;
