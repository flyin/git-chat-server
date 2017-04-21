const url = require('url');
const settings = require('../../settings');

function getSettings() {
  return {
    _id: 'app-settings',

    github: {
      _id: 'app-settings-github',
      clientId: settings.github.clientId,
      redirectUri: settings.github.callbackURL,
      responseType: 'code',
      scope: 'user:email,public_repo',

      url: url.format({
        hostname: 'github.com',
        pathname: '/login/oauth/authorize',
        protocol: 'https',

        query: {
          client_id: settings.github.clientId,
          redirect_uri: settings.github.callbackURL,
          response_type: 'code',
          scope: 'user:email,public_repo'
        }
      })
    }
  }
}

module.exports = {getSettings};
