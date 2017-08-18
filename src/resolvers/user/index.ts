export default {
  Mutation: {
    createTokenByCode: require('./create-token-by-code'),
    createTokenByPassword: require('./create-token-by-password'),
    createUser: require('./create-user')
  },

  Query: {
    getUser: require('./get-user')
  }
};
