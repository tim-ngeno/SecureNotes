import winston, { Logger, transports, format } from 'winston';

const { combine, cli, json, prettyPrint, printf, timestamp } = format;

const timezoned = () => {
  return new Date().toLocaleString('en-US');
};

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    // cli(),
    timestamp({ format: timezoned }),
    printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),

  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'logs/audit.log',
      level: 'info',
      format: combine(
        json(),
        timestamp({ format: timezoned }),
        prettyPrint()
      )
    }),

    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(
        json(),
        timestamp({ format: timezoned }),
        prettyPrint()
      )
    })
  ]
});

export default logger;
