import { mongoose, dbConnect } from 'services/mongoose';
import logger from 'utils/logger';

export function clearDatabase() {
  return new Promise(resolve => {
    for (const i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove({});
    }

    resolve();
  });
}

if (require.main === module) {
  process.env.APP_ENV = 'COMMAND';
  require('dotenv').config();

  dbConnect().then(() => clearDatabase()
    .then(() => {
      logger.info('Completed');
      mongoose.disconnect();
    })

    .catch(err => logger.error(err))
  );
}
