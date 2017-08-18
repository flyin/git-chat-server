import createChannel from './create-channel';
import createMessage from './create-message';
import getChannel from './get-channel';
import getChannels from './get-channels';
import getMessages from './get-messages';
import onChannel from './on-channel';
import onMessage from './on-message';

export default {
  Mutation: {
    createChannel,
    createMessage
  },

  Query: {
    getChannel,
    getChannels,
    getMessages
  },

  Subscription: {
    onChannel,
    onMessage
  }
};
