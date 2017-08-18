// import Axios from 'axios';
// import { find, get } from 'lodash';
// import { mongoose } from 'services/mongoose';
// import * as GitHubApi from 'github';
// import settings from 'settings';

// const User = mongoose.model('User');

module.exports = async (_: any, /*{ code }: { code: string }*/) => {
  return Promise.reject({err: new Error('Not implemented yet')});

  /*
  const response = await Axios({
    data: {
      client_id: settings.github.clientId,
      client_secret: settings.github.clientSecret,
      code
    },

    headers: {
      'Accept': 'application/json'
    },

    method: 'post',
    url: 'https://github.com/login/oauth/access_token'
  });

  if (!response.data.access_token) {
    throw new Error(get(response.data, 'error_description', 'oauth_receive_error'));
  }

  const client = createGithubClient();
  client.authenticate({ token: response.data.access_token, type: 'oauth' });
  const userResponse = await client.users.get({});
  let emailsResponse;

  if (!userResponse.data.email) {
    emailsResponse = await client.users.getEmails({ page: 1 });
  }

  return User.findOneAndUpdate(
    { email: userResponse.data.email || (find(emailsResponse.data, { primary: true, verified: true }) || {email: ''}).email },

    {
      avatar: userResponse.data.avatar_url,

      github: {
        accessToken: response.data.access_token,
        githubId: userResponse.data.id,
        name: userResponse.data.name,
        scopes: userResponse.data.scopes
      }
    },

    { new: true, upsert: true }
  );
  */
};

/*
function createGithubClient() {
  return new GitHubApi({ debug: !settings.isProduction, headers: { 'user-agent': '@flyin/git-chat-server' } });
}
*/
