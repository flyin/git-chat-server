const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');


const Chat = require('./chat');
const Settings = require('./settings');
const User = require('./user');

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

type Subscription {
  onMessage(channelId: ID!): Message
}
`];

const rootResolvers = {
  Mutation: {
    createChannel: (_, { name }, context) => Chat.handlers.createChannel({ name }, context),
    createMessage: (_, { channelId, text }, context) => Chat.handlers.createMessage({ channelId, text }, context),
    createTokenByCode: (_, { code }) => User.handlers.createToken({ code }),
    createTokenByPassword: (_, { email, password }) => User.handlers.createToken({ email, password }),
    createUser: (_, { email, password }) => User.handlers.createUser({ email, password }),
  },

  Query: {
    channel: (_, { channelId }, context) => Chat.handlers.getChannel({ channelId }, context),
    channels: (_, { userId }, context) => Chat.handlers.getChannels({ userId }, context),
    me: (_root, _args, context) => context.currentUser && context.currentUser.get(),
    messages: (_, { channelId }, context) => Chat.handlers.getMessages({ channelId }, context),
    settings: () => Settings.handlers.getSettings(),
    user: (_, { userId }, context) => User.handlers.getUser({ userId }, context)
  },

  Subscription: {
    onMessage: Chat.handlers.onMessage
  }
};

const schema = [...rootSchema, ...Chat.schema, ...User.schema, ...Settings.schema];
const resolvers = merge(rootResolvers);

const executableSchema = makeExecutableSchema({
  resolvers,
  typeDefs: schema
});

module.exports = executableSchema;
