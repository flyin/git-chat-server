const channelModel = require('./model');

function getChannel({ channelId }, context) {
  return channelModel.findById(channelId);
}

function getChannels({ userId }, context) {
  return channelModel.find({}).sort('name');
}

async function createChannel({ name }, context) {
  // const currentUser = await context.currentUser.get();

  return channelModel.create({
    // createdBy: currentUser,
    name
  });
}

module.exports = { createChannel, getChannel, getChannels };
