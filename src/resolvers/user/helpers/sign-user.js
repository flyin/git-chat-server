const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const settings = require('../../../settings');

module.exports = (user) => ({
    _id: mongoose.Types.ObjectId(),
    exp: moment().add(7, 'days').format(),
    iat: moment().format(),
    token: jwt.sign({ userId: user.id }, settings.secret, { expiresIn: '7d' }),
    user
});
