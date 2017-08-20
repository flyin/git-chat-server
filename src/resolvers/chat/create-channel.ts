import { Channel } from 'models';
import pubsub from 'services/subscriptions';

export default async (_: any, { name }: { name: string }) => {
  // const currentUser = await context.currentUser.get();

  const channel = await Channel.create({
    // createdBy: currentUser,
    name
  });

  pubsub.publish('onMessage', { channelId: channel._id, onChanel: channel });
  return channel;
};
