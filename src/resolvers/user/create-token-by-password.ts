import { User } from 'models';
import signUser from './helpers/sign-user';

export default async (_: any, { email, password }: { email: string, password: string }) => {
  const user = await User.findOne({ email });

  if (!user || !user.id || !await user.passwordIsValid(password)) {
    throw new Error('Login or password incorrect');
  }

  return signUser(user);
};
