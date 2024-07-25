const express = require('express');
const path = require('path');

const router = express.Router();
const rootDir = require('../util/path');
const productList = [];

router.get('/add-product', (req, res) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path : '/admin/add-product'
    });
});

router.post('/add-product', (req, res, next) => {
    productList.push({
        title : req.body.title
    });
    res.redirect('/');
});

module.exports = {
    routes : router,
    productList
};
