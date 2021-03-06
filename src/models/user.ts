import * as mongoose from 'mongoose';
import * as validator from 'validator';
import * as bcrypt from 'bcrypt';

const SALT_FACTOR = 5;

export interface UserModel extends mongoose.Document {
  avatar: string;
  email: string;
  github?: GithubModel;
  isAdmin: boolean;
  password: string;
  passwordIsValid: (password: string) => Promise<boolean>;
}

export interface GithubModel extends mongoose.Document {
  accessToken: string;
  githubId: number;
  name: string;
  refreshToken: string;
  scopes: [string];
}

const Github = new mongoose.Schema({
  accessToken: { required: true, type: String },
  githubId: { required: true, type: Number },
  name: { default: null, type: String },
  refreshToken: { default: null, type: String },
  scopes: { type: [String] }
});

const user = new mongoose.Schema({
  avatar: { default: null, type: String },

  email: {
    required: true,
    trim: true,
    type: String,
    unique: true,

    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Email address `{VALUE}` is incorrect'
    }
  },

  github: { required: false, type: Github },
  isAdmin: { default: false, type: Boolean },
  password: { default: null, type: String }
}, {
  timestamps: true
});

user.pre('save', async function (this: UserModel, next) {
  if (!this.isModified('password') && this.password) {
    return next();
  }

  try {
    const
      salt = await bcrypt.genSalt(SALT_FACTOR);

    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

user.methods.passwordIsValid = async function (this: UserModel, password: string) {
  return await bcrypt.compare(password, this.password);
};

mongoose.model<UserModel>('User', user);
