import { mongoose } from 'services/mongoose';
import pubsub from 'services/subscriptions';

const Message = mongoose.model('Message');
const Channel = mongoose.model('Channel');

export default async (_: any, { channelId, text }: { channelId: string, text: string }) => {
  const channel = await Channel.findById(channelId);

  if (!channel) {
    throw new Error(`Channel with channelId: ${channelId} not found or you haven't access to it`);
  }

  const message = await Message.create({ channel, text });
  pubsub.publish('onMessage', { channelId: channelId, onMessage: message });
  return message;
};
