const mongoose = require('mongoose');

const signUser = require('./helpers/sign-user');

const User = mongoose.model('User');

module.exports = async (_, { email, password }) => {
  throw new Error('Not implemented yet');

  const user = await User.findOne({ email });

  if (!user || !await user.passwordIsValid(password)) {
    throw new Error('Login or password incorrect')
  }

  return signUser(user);
};
