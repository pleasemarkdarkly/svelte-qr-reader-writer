import { format } from 'winston';
import winston = require('winston');

export const logger = winston.createLogger({
  level: 'verbose',
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      format: format.combine(
        format.prettyPrint(),
        format.colorize({ all: true }),
        format.printf(info => {
          const { level, message, ...rest } = info;
          const now = new Date();
          const hours = ('0' + now.getHours()).slice(-2);
          const minutes = ('0' + now.getMinutes()).slice(-2);
          const seconds = ('0' + now.getSeconds()).slice(-2);
          // eslint-disable-next-line max-len
          return (
            `[${level}][${hours}:${minutes}:${seconds}] ${message}` +
            `${Object.keys(rest).length ? '\n' + JSON.stringify(rest, null, 2) : ''}`
          );
        }),
      ),
    }),

    new winston.transports.Console({
      // filename: `${date.toLocaleString().replace(/\//g, '-')}.log`,
      format: format.combine(format.timestamp(), format.prettyPrint()),
      handleExceptions: true,
    }),
  ],
});
