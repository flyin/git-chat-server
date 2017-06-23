const { channelModel } = require('../models');

module.exports = ({ name }, context) => {
  // const currentUser = await context.currentUser.get();

  return channelModel.create({
    // createdBy: currentUser,
    name
  });
};
