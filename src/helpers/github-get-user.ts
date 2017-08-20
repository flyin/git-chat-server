import * as Github from 'github';
import { GithubResponse } from './interfaces';

type UserResponse = {
  avatar_url?: string;
  id: number;
  name: string;
};

export default async (client: Github) => {
  const user: GithubResponse<UserResponse> = await client.users.get({});
  return user.data;
};
