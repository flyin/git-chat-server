import * as mongoose from 'mongoose';
import signUser from './helpers/sign-user';
import { UserModel } from 'models/user';

const User = mongoose.model<UserModel>('User');

module.exports = async (_: any, { email, password }: { email: string, password: string }) => {
  const user = await User.findOne({ email });

  if (!user || !user.id || !await user.passwordIsValid(password)) {
    throw new Error('Login or password incorrect');
  }

  return signUser(user);
};
