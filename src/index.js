const express = require('express');
const debug = require('debug')('app:server');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const {
  usersRoute, authRoute, productsRoute, categoriesRoute, reviewsRoute, ordersRoute,
} = require('./routes');

dotenv.config();
require('./database');

const errors = require('./middleware/errors');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/products', productsRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/reviews', reviewsRoute);
app.use('/api/orders', ordersRoute);
app.use(errors);

const port = process.env.PORT || 3000;

app.listen(port, () => debug(`App listening on port ${port}!`));
