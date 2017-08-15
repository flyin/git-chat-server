process.env.APP_ENV = 'API';
require('dotenv').config();

const { createServer } = require('http');

const logger = require('./utils/logger');
const { connection } = require('./services/mongoose');


connection.then(() => {
  const { koa, schema } = require('./services/koa');
  const { SubscriptionServer } = require('subscriptions-transport-ws');
  const { execute, subscribe } = require('graphql');
  const settings = require('./settings');


  const server = createServer(koa.callback());
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

    logger.info(`Listening: http://0.0.0.0:${settings.apiPort}`);
    logger.info(`Websocket: ws://0.0.0.0:${settings.apiPort}/subscriptions`);
  });
}).catch(err => logger.error(err));
