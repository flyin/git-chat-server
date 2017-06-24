const { messageModel } = require('../models');

module.exports = ({ channelId }, context) => {
  return messageModel.find({ 'channel._id': channelId }).sort('-createdAt');
};
