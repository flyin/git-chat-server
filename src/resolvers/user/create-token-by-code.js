const mongoose = require('mongoose');
const { get, find } = require('lodash');
const axios = require('axios');
const GitHubApi = require('github');

const settings = require('../../settings');


const User = mongoose.model('User');

module.exports = async (_, { code }) => {
  throw new Error('Not implemented yet');

  const response = await axios({
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
    { email: userResponse.data.email || (find(emailsResponse.data, { primary: true, verified: true }) || {}).email },

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
};

function createGithubClient() {
  return new GitHubApi({ debug: !settings.isProduction, headers: { 'user-agent': '@flyin/git-chat-server' } });
}

