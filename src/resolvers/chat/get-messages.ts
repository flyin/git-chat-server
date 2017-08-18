import * as mongoose from 'mongoose';

const Message = mongoose.model('Message');

export default (_: any, { channelId }: { channelId: string }) => {
  return Message.find({ 'channel._id': channelId }).sort('-createdAt');
};
