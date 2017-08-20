import { User } from 'models';

export default async (_: any, user: { email: string, password: string }) => {
  return User.create(user);
};
