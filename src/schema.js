const fs = require('fs');
const { join } = require('path');

const { merge, flatten } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');

const chatResolvers = require('./resolvers/chat');
const settingsResolvers = require('./resolvers/settings');
const userResolvers = require('./resolvers/user');


const rootSchema = [`
type Query {
  getSettings: Settings!
  getChannels: [Channel]
  getChannel(channelId: ID!): Channel!
  getMessages(channelId: ID!): [Message]
  getUser(userId: ID): User
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
  onChannel: Channel!
}
`];

const schemasPath = join(__dirname, 'schemas');

module.exports = makeExecutableSchema({
  resolvers: merge(chatResolvers, settingsResolvers, userResolvers),

  typeDefs: [
    ...rootSchema,
    ...flatten(fs.readdirSync(schemasPath).map(file => require(join(schemasPath, file))))
  ]
});
