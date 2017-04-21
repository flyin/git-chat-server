process.env.APP_ENV = 'API';
require('dotenv').config();

const http = require('http');
const settings = require('./settings');
const koa = require('./services/koa');
const mongoose = require('./services/mongoose');
const logger = require('./utils/logger');

const server = http.createServer(koa.callback());

mongoose.connection.once('open', () => {
  logger.info(`Connected to: ${settings.mongoURL}`);
  server.listen(settings.apiPort, () => logger.info(`Server is ready at: http://127.0.0.1:${settings.apiPort}`));
});
