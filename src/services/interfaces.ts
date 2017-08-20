import { UserModel } from 'models/user';

export interface GraphQLContext {
  currentUser: Promise<UserModel>;
}
