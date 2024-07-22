const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded());

app.use('/add-product', (req, res) => {
    console.log('prod');
    res.send(`<form action="/product" method="post">
        <input type="text" name="title" /> <button type="submit">Send</button></form>`);
});

app.post('/product', (req, res, next) => {
    console.log(req.body);
    console.log('pooooooooooost');
    res.redirect('/');
});

app.use('/', (req, res) => {
    console.log('aaa1');
    res.send('<h1>Home</h1>');
});

app.listen(3000);
