const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes  = require('./routes');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.listen(3000);
