import * as mongoose from 'mongoose';

const User = mongoose.model('User');

export default async (_: any, user: { name: string }) => {
  return await User.create(user);
};
