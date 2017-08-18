import * as mongoose from 'mongoose';
import { UserModel } from 'models/user';

const User = mongoose.model<UserModel>('User');

export default async (_: any, user: { email: string, password: string }) => {
  return User.create(user);
};
