import { mongoose } from 'services/mongoose';

export function clearDatabase () {
  const promises = [];

  for (const i in mongoose.connection.collections) {
    promises.push(mongoose.connection.collections[i].remove({}));
  }

  return Promise.all(promises);
}
