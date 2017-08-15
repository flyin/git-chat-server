module.exports = {
  Mutation: {
    createChannel: require('./create-channel'),
    createMessage: require('./create-message')
  },

  Query: {
    getChannel: require('./get-channel'),
    getChannels: require('./get-channels'),
    getMessages: require('./get-messages')
  },

  Subscription: {
    onChannel: require('./on-channel'),
    onMessage: require('./on-message')
  }
};
