import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import session from 'express-session';
import temp from 'connect-session-sequelize';
import routes from './routes.js';
import { sequelize } from './util/database.js';
import databaseLoader from './util/databaseLoader.js';

// Sequelize Models
import User            from './models/user.js';
import Product         from './models/product.js';
import Cart            from './models/cart.js';
import Order           from './models/order.js';
import ProductLineItem from './models/product-line-item.js';
import Address         from './models/address.js';
import ShippingMethod  from './models/shipping-method.js';

const SequelizeStore = temp(session.Store);

const app = express();

app.use(
    session({
        secret: 'keyboard cat',
        store: new SequelizeStore({
            db: sequelize,
        }),
        resave: false, // we support the touch method so per the express-session docs this should be set to false
        proxy: true, // if you do SSL outside of node.
        saveUninitialized: true,
    })
);

// TODO For some reason this doesn't work. It seems the promisse is called after the actual http request
app.use(async (req, res, next) => {
    const userId = req.session.user ? req.session.user.id : null;

    // TODO Check if it's possible to put it in session only;
    if (req.session.user) {
        res.locals.userName       = req.session.user.name;
        res.locals.isUserLoggedIn = req.session.isUserLoggedIn;
    }

    if (userId && req.session.isUserLoggedIn) {
        const user = await User.findByPk(userId, { include: [{ model: Cart, include: ['products'] }]});

        if (user.cart) {
            res.locals.cartProductQty = user.cart.products.length;
        }

        req.session.user = user;
    }

    next();
});

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, 'public')));
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

const starServer = async () => {
    const shouldForce = false;

    await sequelize.sync({ force : shouldForce });

    if (shouldForce) {
        await databaseLoader.loadUserData();
        await databaseLoader.loadProductData();
        await databaseLoader.loadShippingMethodData();
    }

    app.listen(3000);
};

starServer();
