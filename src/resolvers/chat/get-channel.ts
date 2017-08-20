import { Channel } from 'models';

export default (_: any, { channelId }: { channelId: string }) => {
  return Channel.findById(channelId);
};
