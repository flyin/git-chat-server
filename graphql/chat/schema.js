module.exports = [`
type Message {
   _id: ID!
   channel: Channel!
   text: String!
}

type Channel {
   _id: ID!
   name: String!
   createdAt: String!
   updatedAt: String!
}
`];
