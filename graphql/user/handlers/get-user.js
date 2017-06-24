const { userModel } = require('../models');

module.exports = async ({ userId }, context) => {
  const currentUser = context.currentUser && await context.currentUser.get();

  if (!currentUser || !currentUser.isAdmin || userId !== currentUser.id) {
    throw new Error('access_denied');
  }

  return userModel.findById(userId);
};
