import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import settings from 'settings';
import { UserModel } from 'models/user';

export default (user: UserModel) => ({
  _id: mongoose.Types.ObjectId(),
  exp: moment().add(7, 'days').format(),
  iat: moment().format(),
  token: jwt.sign({ userId: user.id }, settings.secret, { expiresIn: '7d' }),
  user
});
