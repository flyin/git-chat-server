import { get } from 'lodash';
import settings from 'settings';
import axios from 'axios';

type GithubAccessToken = {
  access_token?: string;
  scope?: string;
  token_type?: string;
  error_description?: string;
};

export default async (code: string) => {
  const tokenResponse = await axios.post(
    'https://github.com/login/oauth/access_token',

    {
      client_id: settings.github.clientId,
      client_secret: settings.github.clientSecret,
      code
    },
    {
      headers: {
        'Accept': 'application/json'
      }
    }
  );

  return get<GithubAccessToken>(tokenResponse, 'data', {});
};
