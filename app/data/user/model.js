const validator = require('validator');
const bcrypt = require('bcrypt');
const mongoose = require('../../services/mongoose');

const Schema = mongoose.Schema;
const SALT_FACTOR = 5;

const Github = new Schema({
  githubId: { type: Number, required: true },
  accessToken: { type: String, required: true },
  name: { type: String, default: null },
  refreshToken: { type: String, default: null },
  scopes: { type: String },
});

const User = new Schema({
  avatar: { type: String, default: null },
  isAdmin: { type: Boolean, default: false },

  github: { type: Github, required: false },

  password: { default: null, type: String },

  email: {
    required: true,
    trim: true,
    type: String,
    unique: true,
    validate: [validator.isEmail, 'Email address `{VALUE}` is incorrect']
  }
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
