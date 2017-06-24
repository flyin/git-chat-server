const { channelModel } = require('../models');

module.exports = ({ channelId }, context) => {
  return channelModel.findById(channelId);
};
