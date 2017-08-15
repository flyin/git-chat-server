const mongoose = require('mongoose');


const Channel = mongoose.model('Channel');

module.exports = (_, { userId }, context) => {
  return Channel.find({}).sort('name');
};
