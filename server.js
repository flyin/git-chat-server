process.env.APP_ENV = 'API';
require('dotenv').config();

const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');

const settings = require('./settings');
const { koa, schema } = require('./services/koa');
const mongoose = require('./services/mongoose');
const logger = require('./utils/logger');


const server = createServer(koa.callback());

mongoose.connection.once('open', () => {
  logger.info(`Connected to: ${settings.mongoURL}`);

  server.listen(settings.apiPort, () => {
    new SubscriptionServer({
      execute,
      schema,
      subscribe,
    }, {
      path: '/subscriptions',
      server,
    });

    logger.info(`Server is ready at: http://127.0.0.1:${settings.apiPort}`)
  });
});
