const { RedisPubSub } = require('graphql-redis-subscriptions');
import settings from 'settings';

const pubsub = new RedisPubSub({
  connection: {
    host: settings.redis.host,
    port: settings.redis.port
  }
});

export default pubsub;
