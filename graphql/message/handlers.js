const model = require('./model');
const Channel = require('../channel');

async function createMessage({ channelId, text }, context) {
  return model.create({
    channel: await Channel.model.findById(channelId),
    text
  });
}

function getMessages({ channelId }, context) {
  return model.find({ 'channel._id': channelId}).sort('-createdAt');
}

module.exports = { createMessage, getMessages };
