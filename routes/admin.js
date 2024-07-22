const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res) => {
    console.log('prod');
    res.send(`<form action="/product" method="post">
        <input type="text" name="title" /> <button type="submit">Send</button></form>`);
});

router.post('/product', (req, res, next) => {
    console.log(req.body);
    console.log('pooooooooooost');
    res.redirect('/');
});

module.exports = router;
