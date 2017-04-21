process.env.APP_ENV = 'COMMAND';
require('dotenv').config();

const logger = require('../utils/logger');
const mongoose = require('../services/mongoose');

function clearDatabase () {
  return new global.Promise(resolve => {
    for(const i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(f => f);
    }

    resolve();
  });
}

module.exports = { clearDatabase };

if (require.main === module) {
  mongoose.connection.once('open', () => {
    clearDatabase()
      .then(() => {
        logger.info('Clear database completed');
        mongoose.disconnect();
      })

      .catch(err => logger.error(err))
  });
}
