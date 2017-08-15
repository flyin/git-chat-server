const { withFilter } = require('graphql-subscriptions');
const pubsub = require('../../services/subscriptions');

module.exports = {
  subscribe: withFilter(() => pubsub.asyncIterator('onChannel'), () => true)
};
