const mongoose = require('mongoose');
const debug = require('debug')('app:database');

const mongooseOptions = {
  useNewUrlParser: true,
};

const connection = mongoose.connect(
  process.env.MONGODB_URI,
  mongooseOptions,
);
connection
  .then(() => debug('Connected to database'))
  .catch(({ message }) => {
    debug(`Error connecting to database: ${message}`);
  });
