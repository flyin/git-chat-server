const pubsub = require('../../../services/subscriptions');
const { messageModel, channelModel } = require('../models');

module.exports = async ({ channelId, text }, context) => {
  const message = await messageModel.create({
    channel: await channelModel.findById(channelId),
    text
  });

  pubsub.publish('onMessage', { channelId: channelId, onMessage: message });
  return message;
};
