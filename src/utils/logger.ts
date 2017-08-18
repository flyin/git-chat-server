import * as winston from 'winston';
import * as moment from 'moment';

export default new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      formatter(options): string {
        return `${options.timestamp()} ${options.level} [${process.env.APP_ENV || 'UNKNOW ENV'}] ${(options.message ? options.message : '')} ${options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''}`
      },

      timestamp() {
        return moment().format()
      }
    })
  ]
});
