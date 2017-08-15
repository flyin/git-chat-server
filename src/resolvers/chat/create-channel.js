const mongoose = require('mongoose');

const pubsub = require('../../services/subscriptions');


const Channel = mongoose.model('Channel');

module.exports = async (_, { name }) => {
  // const currentUser = await context.currentUser.get();

  const channel = await Channel.create({
    // createdBy: currentUser,
    name
  });

  pubsub.publish('onMessage', { channelId: channel._id, onChanel: channel });
  return channel;
};
