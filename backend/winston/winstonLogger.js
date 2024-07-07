
const { createLogger, transports, format } = require("winston");

const { combine, timestamp, printf, errors ,prettyPrint,json } = format;

const myFormat = printf(({ level, message, timestamp, stack }) => {
  if(!stack)
  return `${timestamp} ${level}: ${message}`;

  return  `${timestamp} ${level}: ${message}  ${stack}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    myFormat,
    json(),
    prettyPrint(),
  ),
  transports: [
    new transports.File({ filename: 'combined.log' }),
  ],
});

 module.exports = logger;
