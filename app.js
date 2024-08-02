const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes  = require('./routes');
const database = require('./util/database');
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const ProductLineItem = require('./models/product-line-item');

const sequelize = database.sequelize;
const app = express();

// TODO For some reason this doesn't work. It seems the promisse is called after the actual http request
// app.use((req, res, next) => {
//     User.findByPk(1)
//         .then(user => {
//             req.user = user;
//         });
//     next();
// });

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

User.hasOne(Cart);
Cart.belongsToMany(Product, { through : ProductLineItem });
Product.belongsToMany(Cart, { through : ProductLineItem });

sequelize
    // .sync({ force : true})
    .sync();
// .then(result => {
//     database.loadDatabaseProductData();
// })
// .then(result => {
//     return User.findByPk(1);
// })
// .then(user => {
//     if (!user) {
//         return User.create({
//             name: 'Fabiow',
//             email: 'ftquixada@gmail.com'
//         });
//     }

//     return user;
// })
// .then(user => {
//     user.createCart();
// })
// .then(cart => {
// })
// .catch(err => console.log(err));
app.listen(3000);

