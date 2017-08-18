import { Schema, MongooseThenable } from 'mongoose';
import { readdirSync } from 'fs';
import { join } from 'path';
import settings from 'settings';

const mongoose = require('mongoose');
mongoose.set('debug', !settings.isProduction && settings.env !== 'test');
mongoose.Promise = Promise;

const modelsPath = join(__dirname, '..', 'models');
readdirSync(modelsPath).forEach(file => require(join(modelsPath, file)));

const dbConnect = (): MongooseThenable => mongoose.connect(settings.mongoURL, { useMongoClient: true });

export { mongoose, Schema, dbConnect };
