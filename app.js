const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const routes  = require('./routes');
const database = require('./util/database');

// Sequelize Models
const User            = require('./models/user');
const Product         = require('./models/product');
const Cart            = require('./models/cart');
const Order           = require('./models/order');
const ProductLineItem = require('./models/product-line-item');
const Address         = require('./models/address');
const ShippingMethod  = require('./models/shipping-method');

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

    if (userId && req.session.isUserLoggedIn) {
        User
            .findByPk(userId, { include: [{ model: Cart, include: ['products'] }]})
            // .then(user => {
            //     u = user;
            //     if (user.cart) {
            //         return user.cart;
            //     }

            //     return user.createCart();
            // })
            .then(user => {
                if (user.cart) {
                    res.locals.cartProductQty = user.cart.products.length;
                }

                req.session.user = user;
                next();
            });
    } else {
        next();
    }
});

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.use((error, req, res, next) => {
    console.log(error);
    res.
        status(500)
        .redirect('/500', {
            error
        });
});

User.hasOne(Cart);
User.hasMany(Order);
User.hasMany(Address);
Cart.belongsToMany(Product, { through : ProductLineItem });
Cart.belongsTo(Address, { as: 'shippingAddress' });
Cart.belongsTo(Address, { as: 'billingAddress' });
Cart.belongsTo(ShippingMethod, { as: 'shippingMethod' }); // TODO Is this alias necessary?
Order.belongsToMany(Product, { through : ProductLineItem });
Order.belongsTo(Address, { as: 'shippingAddress' });
Order.belongsTo(Address, { as: 'billingAddress' });
Product.belongsToMany(Cart, { through : ProductLineItem });

const shouldForce = false;

sequelize
    .sync(
        { force : shouldForce }
    )
    .then(result => {
        if (shouldForce) {
            database.loadDatabaseProductData();
        }
    })
    .then(result => {
        if (shouldForce) {
            database.loadDatabaseShippingMethodData();
        }
    })
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({
                name     : 'Fabiow',
                email    : 'ftquixada@gmail.com',
                password : '123'
            });
        }

        return user;
    });
// .then(user => {
//     user.createCart();
// })
// .then(cart => {
// })
// .catch(err => console.log(err));
app.listen(3000);

