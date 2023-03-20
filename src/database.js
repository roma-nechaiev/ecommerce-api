const mongoose = require('mongoose');
const debug = require('debug')('app:database');

const mongooseOptions = {
  useNewUrlParser: true,
};

const connection = mongoose.connect(
  'mongodb://localhost:27017/shop',
  mongooseOptions,
);
connection
  .then(() => debug('Connected to database'))
  .catch(({ message }) => {
    debug(`Error connecting to database: ${message}`);
  });
