const mongoose = require('mongoose');


const Message = mongoose.model('Message');

module.exports = (_, { channelId }, context) => {
  return Message.find({ 'channel._id': channelId }).sort('-createdAt');
};
