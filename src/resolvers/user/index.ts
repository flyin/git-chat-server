import createUser from './create-user';
import createTokenByPassword from './create-token-by-password';
import createTokenByCode from './create-token-by-code';
import getUser from './get-user';

export default {
  Mutation: {
    createTokenByCode,
    createTokenByPassword,
    createUser
  },

  Query: {
    getUser
  }
};
