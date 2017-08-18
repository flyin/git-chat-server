import { merge, concat } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import { chatResolvers, settingsResolvers, userResolvers } from 'resolvers';
import { chatSchema, settingsSchema, userSchema } from 'schemas';

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

export default makeExecutableSchema({
  resolvers: merge(chatResolvers, settingsResolvers, userResolvers),
  typeDefs: concat([], rootSchema, chatSchema, settingsSchema, userSchema)
});
