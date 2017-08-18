import * as mongoose from 'mongoose';

const Channel = mongoose.model('Channel');

export default (_: any, { channelId }: { channelId: string }) => {
  return Channel.findById(channelId);
};
