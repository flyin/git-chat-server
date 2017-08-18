import { mongoose } from 'services/mongoose';

export function clearDatabase() {
  return new Promise(resolve => {
    for (const i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove({});
    }

    resolve();
  });
}
