const mongoose = require('mongoose');

const pubsub = require('../../services/subscriptions');


const Message = mongoose.model('Message');
const Channel = mongoose.model('Channel');

module.exports = async (_, { channelId, text }, context) => {
  const channel = await Channel.findById(channelId);

  if (!channel) {
    throw new Error(`Channel with channelId: ${channelId} not found or you haven't access to it`);
  }

  const message = await Message.create({ channel, text });
  pubsub.publish('onMessage', { channelId: channelId, onMessage: message });
  return message;
};
