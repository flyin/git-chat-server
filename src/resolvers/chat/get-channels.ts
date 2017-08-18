import * as mongoose from 'mongoose';

const Channel = mongoose.model('Channel');

export default (_: any) => {
  return Channel.find({}).sort('name');
};
