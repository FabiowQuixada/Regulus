const express = require('express');

const app = express();

app.use('/add-product', (req, res) => {
    console.log('prod');
    res.send(`<form action="/product" method="post">
        <input type="text" name="title" /> <button type="submit">Send</button></form>`);
});

app.use('/product', (req, res, next) => {

    res.redirect('/');
});

app.use('/', (req, res) => {
    console.log('aaa');
    res.send('<h1>Home</h1>');
});

app.listen(3000);
