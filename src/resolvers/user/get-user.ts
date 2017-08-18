import * as mongoose from 'mongoose';

const User = mongoose.model('User');

module.exports = async (_: any, { userId }: { userId: string }) => {
  return User.findById(userId);
};
