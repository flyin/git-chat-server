/* eslint-disable max-len */
const winston = require('winston');
const moment = require('moment');

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      formatter (options) {
        return `${options.timestamp()} ${options.level} [${process.env.APP_ENV || 'UNKNOW ENV'}] ${(options.message ? options.message : '')} ${options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''}`
      },

      timestamp () {
        return moment().format()
      }
    })
  ]
});
