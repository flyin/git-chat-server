import * as mongoose from 'mongoose';
import { GraphQLContext } from 'services/koa';
import { UserModel } from 'models/user';

const User = mongoose.model<UserModel>('User');

type Input = {
  userId?: string
}

export default async (_: any, { userId }: Input, context: GraphQLContext) => {
  let currentUser: UserModel;

  try {
    currentUser = await context.currentUser;
  } catch (err) {
    return err;
  }

  if (currentUser.isAdmin && userId) {
    return User.findById(userId);
  }

  return currentUser;
};
