import { Message } from 'models';

export default (_: any, { channelId }: { channelId: string }) => {
  return Message.find({ 'channel._id': channelId }).sort('-createdAt');
};
