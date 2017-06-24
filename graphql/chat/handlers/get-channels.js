const { channelModel } = require('../models');

module.exports = ({ userId }, context) => {
  return channelModel.find({}).sort('name');
};
