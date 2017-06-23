const { get } = require('lodash');
const jwt = require('jsonwebtoken');

const settings = require('../../../settings');
const logger = require('../../../utils/logger');
const { userModel } = require('../models');


module.exports = ({ headers, query }) => {
  const token = get(headers, 'authorization') || get(query, 'access_token');

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, settings.secret);
    return new LazyUser(payload.userId);
  } catch (err) {
    return null;
  }
};

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

    this._user = userModel.findOne({ _id: this.id }).catch(this.onReject);
    return this._user;
  }
}
