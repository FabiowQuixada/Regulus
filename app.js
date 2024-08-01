const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes  = require('./routes');
const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

sequelize
    .sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));

