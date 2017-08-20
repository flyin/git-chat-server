import { User } from 'models';
import { GraphQLContext } from 'services';
import { UserModel } from 'models/user';

type Input = {
  userId?: string
};

export default async (_: any, { userId }: Input, context: GraphQLContext) => {
  let currentUser: UserModel;

  try {
    currentUser = await context.currentUser;
  } catch (err) {
    return err;
  }

  if (!currentUser) {
    throw new Error('Auth required');
  }

  if (currentUser.isAdmin && userId) {
    return User.findById(userId);
  }

  return currentUser;
};
