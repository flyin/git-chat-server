const logger = require('../utils/logger');
const mongoose = require('../services/mongoose');

function clearDatabase () {
  return new Promise(resolve => {
    for(const i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(f => f);
    }

    resolve();
  });
}

module.exports = { clearDatabase };

if (require.main === module) {
  process.env.APP_ENV = 'COMMAND';
  require('dotenv').config();

  mongoose.connection.once(
    'open',

    () => clearDatabase()
      .then(() => {
        logger.info('Completed');
        mongoose.disconnect();
      })

      .catch(err => logger.error(err))
  );
}
