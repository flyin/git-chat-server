const mongoose = require('mongoose');
const settings = require('../settings');

mongoose.set('debug', !settings.isProduction && settings.env !== 'test');
mongoose.Promise = Promise;
module.exports = mongoose;

mongoose.connect(settings.mongoURL);
