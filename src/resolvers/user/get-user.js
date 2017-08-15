const mongoose = require('mongoose');


const User = mongoose.model('User');

module.exports = async (_, { userId }, context) => {
  throw new Error('Not implemented yet');

  const currentUser = context.currentUser && await context.currentUser.get();

  if (!currentUser || !currentUser.isAdmin || userId !== currentUser.id) {
    throw new Error('access_denied');
  }

  return User.findById(userId);
};
