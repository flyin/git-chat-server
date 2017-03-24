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

  return code ? githubLogin(code).then(user => signUser(user)) : userLogin(email, password).then(user => signUser(user));
}

async function createUser(user) {
  return await User.create(user);
}

const getUserById = async ({ id }, context) => {
  const currentUser = context.currentUser && await context.currentUser.get();

  if (!currentUser || !currentUser.isAdmin || id !== currentUser.id) {
    throw new Error('access_denied');
  }

  return await User.findById(id);
};

async function getUserFromRequest({ headers, query }) {
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

module.exports = { createToken, createUser, getUserById, getUserFromRequest };

function signUser(user) {
  return {
    _id: mongoose.Types.ObjectId(),
    token: jwt.sign({ userId: user.id }, settings.secret, { expiresIn: '7d' }),
    iat: moment().format(),
    exp: moment().add(7, 'days').format(),
    user
  }
}

async function githubLogin(code) {
  const response = await axios({
    method: 'post',
    url: 'https://github.com/login/oauth/access_token',

    headers: {
      'Accept': 'application/json'
    },

    data: {
      code,
      client_id: settings.github.clientId,
      client_secret: settings.github.clientSecret
    }
  });

  if (!response.data.access_token) {
    throw new Error(get(response.data, 'error_description', 'oauth_receive_error'));
  }

  const client = getGithubClient();
  client.authenticate({ type: 'oauth', token: response.data.access_token });

  const userResponse = await client.users.get({});
  let emailsResponse;

  if (!userResponse.data.email) {
    emailsResponse = await client.users.getEmails({ page: 1 });
  }

  console.log(userResponse.data);

  return await User.findOneAndUpdate(
    { email: userResponse.data.email || (find(emailsResponse.data, { primary: true, verified: true }) || {}).email },

    {
      avatar: userResponse.data.avatar_url,

      github: {
        githubId: userResponse.data.id,
        accessToken: response.data.access_token,
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

  async get() {
    if (this._user) {
      return this._user;
    }

    try {
      this._user = await User.findOne({ _id: this.id });
      return this._user;
    } catch (err) {
      logger.error(err);
      this._user = null;
      return this._user;
    }
  }
}

function getGithubClient() {
  return new GitHubApi({ debug: !settings.isProduction, headers: { 'user-agent': '@flyin/git-chat-server' } });
}
