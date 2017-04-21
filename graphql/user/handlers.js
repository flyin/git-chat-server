const { get, find } = require('lodash');
const axios = require('axios');
const GitHubApi = require('github');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const User = require('./model');
const mongoose = require('../../services/mongoose');
const settings = require('../../settings');
const logger = require('../../utils/logger');

function createToken({ code, email, password }) {
  if (code && (email || password)) {
    throw new Error('Only code or login+password allowed');
  }

  return code
    ? githubLogin(code).then(user => signUser(user))
    : userLogin(email, password).then(user => signUser(user));
}

async function createUser(user) {
  return await User.create(user);
}

const getUser = async ({ userId }, context) => {
  const currentUser = context.currentUser && await context.currentUser.get();

  if (!currentUser || !currentUser.isAdmin || userId !== currentUser.id) {
    throw new Error('access_denied');
  }

  return User.findById(userId);
};

function getUserFromRequest({ headers, query }) {
  let token = get(headers, 'authorization') || get(query, 'access_token');

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, settings.secret);
    return new LazyUser(payload.userId);
  } catch (err) {
    return null;
  }
}

module.exports = { createToken, createUser, getUser, getUserFromRequest };

function signUser(user) {
  return {
    _id: mongoose.Types.ObjectId(),
    exp: moment().add(7, 'days').format(),
    iat: moment().format(),
    token: jwt.sign({ userId: user.id }, settings.secret, { expiresIn: '7d' }),
    user
  }
}

async function githubLogin(code) {
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
    url: 'https://github.com/login/oauth/access_token',
  });

  if (!response.data.access_token) {
    throw new Error(get(response.data, 'error_description', 'oauth_receive_error'));
  }

  const client = createGithubClient();

  client.authenticate({
    token: response.data.access_token,
    type: 'oauth'
  });

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
}

async function userLogin(email, password) {
  const user = await User.findOne({ email });

  if (!user || !await user.passwordIsValid(password)) {
    throw new Error('Login or password incorrect')
  }

  return user;
}

class LazyUser {
  constructor(id) {
    this.id = id;
    this._user = null;
  }

  onReject(err) {
    logger.error(err);
    this._user = null;
  }

  get() {
    if (this._user) {
      return this._user;
    }

    this._user = User.findOne({ _id: this.id }).catch(this.onReject);
    return this._user;
  }
}

function createGithubClient() {
  return new GitHubApi({ debug: !settings.isProduction, headers: { 'user-agent': '@flyin/git-chat-server' } });
}
