const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res) => {
    res.status(404)
        .render('404', {
            pageTitle: 'Not found'
        });
});

app.listen(3000);
