import signUser from './helpers/sign-user';
import { User } from 'models';
import { GraphQLContext } from 'services';
import { githubCreateClient, githubGetPrimaryEmail, githubGetToken, githubGetUser } from 'helpers';

type Input = {
  code: string
};

export default async (_: any, { code }: Input, context: GraphQLContext) => {
  const oauth = await githubGetToken(code);

  if (!oauth.access_token) {
    throw new Error('access_token_error');
  }

  const client = githubCreateClient(oauth.access_token);
  const githubUser = await githubGetUser(client);
  const primaryEmail = await githubGetPrimaryEmail(client);
  const currentUser = await context.currentUser;

  const user = await User.findOneAndUpdate(
    { $or: [{ _id: currentUser ? currentUser._id : null }, { 'github.githubId': githubUser.id }, { email: primaryEmail.email }] },

    {
      $setOnInsert: {
        email: primaryEmail.email
      },

      $set: {
        github: {
          avatar: githubUser.avatar_url,
          accessToken: oauth.access_token,
          githubId: githubUser.id,
          name: githubUser.name,
          scope: oauth.scope
        }
      }
    },

    { new: true, upsert: true }
  );

  if (!user) {
    throw new Error('user_find_and_update_error');
  }

  return signUser(user);
};
