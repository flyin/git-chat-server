const Channel = require('../channel');

module.exports = [`
type Message {
   _id: ID!
   name: String!
   channel: Channel!
}
`, ...Channel.schema];
