const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
const Channel = require('./channel');
const Message = require('./message');
const User = require('./user');
const Settings = require('./settings');

const rootSchema = [`
type Query {
  settings: Settings!
  channels: [Channel]
  channel(channelId: ID!): Channel!
  messages(channelId: ID!): [Message]
  user(userId: ID!): User
  me: User
}

type Mutation {
  createChannel(name: String!): Channel
  createMessage(text: String!, channelId: String!): Message!
  createUser(email: String! password: String!): User
  createTokenByCode(code: String!): Token
  createTokenByPassword(email: String! password: String!): Token
}
`];

const rootResolvers = {
  Mutation: {
    createChannel(_, { name }, context) {
      return Channel.handlers.createChannel({ name }, context);
    },

    createMessage(_, { channelId, text }, context) {
      return Message.handlers.createMessage({ channelId, text }, context);
    },

    createTokenByCode(_, { code }) {
      return User.handlers.createToken({ code });
    },

    createTokenByPassword(_, { email, password }) {
      return User.handlers.createToken({ email, password });
    },

    createUser(_, { email, password }) {
      return User.handlers.createUser({ email, password });
    },
  },

  Query: {
    channel(_, { channelId }, context) {
      return Channel.handlers.getChannel({ channelId }, context);
    },

    channels(_, { userId }, context) {
      return Channel.handlers.getChannels({ userId }, context);
    },

    me(root, args, context) {
      return context.currentUser && context.currentUser.get();
    },

    messages(_, { channelId }) {
      return Message.handlers.getMessages({ channelId });
    },

    settings() {
      return Settings.handlers.getSettings()
    },

    user(_, { userId }, context) {
      return User.handlers.getUser({ userId }, context);
    }
  }
};

const schema = [...rootSchema, ...Channel.schema, ...Message.schema, ...User.schema, ...Settings.schema];
const resolvers = merge(rootResolvers, Channel.resolvers, Message.resolvers, User.resolvers, Settings.resolvers);

const executableSchema = makeExecutableSchema({
  resolvers,
  typeDefs: schema
});

module.exports = executableSchema;
