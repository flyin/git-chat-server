const Channel = require('../channel');

module.exports = [`
type Message {
   _id: ID!
   channel: Channel!
   text: String!
}
`, ...Channel.schema];
