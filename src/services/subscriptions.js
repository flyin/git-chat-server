const { RedisPubSub } = require('graphql-redis-subscriptions');
const settings = require('../settings');

const pubsub = new RedisPubSub({
  connection: {
    host: settings.redis.host,
    port: settings.redis.port
  }
});

module.exports = pubsub;
