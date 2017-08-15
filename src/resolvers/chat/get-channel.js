const mongoose = require('mongoose');


const Channel = mongoose.model('Channel');

module.exports = (_, { channelId }, context) => {
  return Channel.findById(channelId);
};
