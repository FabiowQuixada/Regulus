const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const routes  = require('./routes');
const database = require('./util/database');
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const Order = require('./models/order');
const ProductLineItem = require('./models/product-line-item');

const sequelize = database.sequelize;
const app = express();

app.use(
    session({
        secret: 'keyboard cat',
        store: new SequelizeStore({
            db: database.sequelize,
        }),
        resave: false, // we support the touch method so per the express-session docs this should be set to false
        proxy: true, // if you do SSL outside of node.
    })
);

// TODO For some reason this doesn't work. It seems the promisse is called after the actual http request
app.use((req, res, next) => {
    const userId = req.session.user ? req.session.user.id : null;

    // TODO Check if it's possible to put it in session only;
    if (req.session.user) {
        res.locals.userName       = req.session.user.name;
        res.locals.isUserLoggedIn = req.session.isUserLoggedIn;
    }

    if (userId && !req.session.isUserLoggedIn) {
        User.findByPk(userId)
            .then(user => {
                if (user) {
                    res.redirect('/');
                } else {
                    next();
                }
            });
    } else {
        next();
    }
});

app.use((req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            if (!cart) {
                return req.user.createCart();
            }
            return cart.getProducts();
        })
        .then(productList => {
            res.locals.cartProductQty = productList.length;
            next();
        })
        .catch( err => {console.log(err);});
});

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

User.hasOne(Cart);
User.hasMany(Order);
Cart.belongsToMany(Product, { through : ProductLineItem });
Order.belongsToMany(Product, { through : ProductLineItem });
Product.belongsToMany(Cart, { through : ProductLineItem });

sequelize
    .sync();
// .sync({ force : true})
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

