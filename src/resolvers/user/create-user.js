const mongoose = require('mongoose');


const User = mongoose.model('User');

module.exports = async (user) => {
  throw new Error('Not implemented yet');

  return await User.create(user);
};
