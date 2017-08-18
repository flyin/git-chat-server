import { createServer } from 'http';
import logger from 'utils/logger';
import { dbConnect } from 'services/mongoose';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import settings from 'settings';

dbConnect().then(() => {
  const { koa, schema } = require('./services/koa');

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
}).catch((err: Error) => logger.error(err.toString(), err.stack));
