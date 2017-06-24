const validator = require('validator');
const bcrypt = require('bcrypt');
const mongoose = require('../../../services/mongoose');

const Schema = mongoose.Schema;
const SALT_FACTOR = 5;

const Github = new Schema({
  accessToken: { required: true, type: String },
  githubId: { required: true, type: Number },
  name: { default: null, type: String },
  refreshToken: { default: null, type: String },
  scopes: { type: String },
});

const User = new Schema({
  avatar: { default: null, type: String },

  email: {
    required: true,
    trim: true,
    type: String,
    unique: true,
    validate: [validator.isEmail, 'Email address `{VALUE}` is incorrect']
  },

  github: { required: false, type: Github },
  isAdmin: { default: false, type: Boolean },
  password: { default: null, type: String },
}, {
  timestamps: true
});

User.pre('save', async function (next) {
  if (!this.isModified('password') && this.password) {
    return next();
  }

  try {
    const
      salt = await bcrypt.genSalt(SALT_FACTOR);

    this.password = await bcrypt.hash(this.password, salt);
    next()
  } catch (err) {
    next(err)
  }
});

User.methods.passwordIsValid = async function (password) {
  return await bcrypt.compare(password, this.password)
};

module.exports = mongoose.model('User', User);
