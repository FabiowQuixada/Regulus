const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const cartRoutes = require('./routes/cart');
const errorsController = require('./controllers/errors');
const homeController = require('./controllers/home');

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes);
app.use(cartRoutes);
app.use(shopRoutes);

app.use(homeController.getHome);
app.use(errorsController.get404);

app.listen(3000);
