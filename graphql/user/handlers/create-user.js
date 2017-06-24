const { userModel } = require('../models');

module.exports = async (user) => {
  return await userModel.create(user);
};
