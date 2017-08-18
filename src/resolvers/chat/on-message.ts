import { withFilter } from 'graphql-subscriptions';
import pubsub from 'services/subscriptions';

export default {
  subscribe: withFilter(() => pubsub.asyncIterator('onMessage'), (payload, variables) => payload.channelId === variables.channelId)
};
