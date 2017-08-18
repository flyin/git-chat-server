import 'models';
import { Mongoose, MongooseThenable } from 'mongoose';
import settings from 'settings';

const mongoose: Mongoose = require('mongoose');
mongoose.set('debug', !settings.isProduction && settings.env !== 'test');
mongoose.Promise = Promise;

const dbConnect = (): MongooseThenable => mongoose.connect(settings.mongoURL, { useMongoClient: true });

export { mongoose, dbConnect };
