const mongoose = require('mongoose');
const fs = require('fs');
const { join } = require('path');

const settings = require('../settings');


const modelsPath = join(__dirname, '..', 'models');
fs.readdirSync(modelsPath).forEach((file) => require(join(modelsPath, file)));

mongoose.set('debug', !settings.isProduction && settings.env !== 'test');
mongoose.Promise = Promise;

module.exports = {
  connection: mongoose.connect(settings.mongoURL, { useMongoClient: true }),
  mongoose
};
