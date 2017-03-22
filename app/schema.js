const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
const Channel = require('./data/channel');
const Message = require('./data/message');
const User = require('./data/user');

const rootSchema = [`
type Query {
  channels: [Channel]
  messages(channelId: ID!): [Message]
  userById(id: ID!): User
  me: User
}

type Mutation {
  createUser(email: String! password: String!): User
  githubLogin(code: String!): Token
  passwordLogin(email: String! password: String!): Token
}
`];

const rootResolvers = {
  Mutation: {
    createUser(_, userInput) {
      return User.handlers.createUser(userInput);
    },

    githubLogin(_, { code }) {
      return User.handlers.createToken({ code });
    },

    passwordLogin(_, { email, password }) {
      return User.handlers.createToken({ email, password });
    }
  },

  Query: {
    channels() {
      return [{ _id: 1, name: '123' }]
    },

    me(root, args, context) {
      return context.currentUser && context.currentUser.get();
    },

    messages() {
      return [{ _id: 1, channel: '123', name: '123' }]
    },

    userById(_, { id }, context) {
      return User.handlers.getUserById({ id }, context)
    }
  }
};

const schema = [...rootSchema, ...Channel.schema, ...Message.schema, ...User.schema];
const resolvers = merge(rootResolvers, Channel.resolvers, Message.resolvers, User.resolvers);

const executableSchema = makeExecutableSchema({
  resolvers,
  typeDefs: schema
});

module.exports = executableSchema;
