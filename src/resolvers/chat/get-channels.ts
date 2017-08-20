import { Channel } from 'models';

export default (_: any) => {
  return Channel.find({}).sort('name');
};
