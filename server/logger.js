const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Custom format for better readability
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }

    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }

    return log;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      )
    }),

    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),

    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),

    // Activity log file (for user actions)
    new winston.transports.File({
      filename: path.join(logsDir, 'activity.log'),
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 10
    })
  ]
});

// Helper functions for common log patterns
logger.activity = (action, details) => {
  logger.info(`ACTIVITY: ${action}`, details);
};

logger.deviceEvent = (event, deviceId, details = {}) => {
  logger.info(`DEVICE_${event.toUpperCase()}`, { deviceId, ...details });
};

logger.apiRequest = (method, path, details = {}) => {
  logger.info(`API: ${method} ${path}`, details);
};

logger.apiError = (method, path, error, details = {}) => {
  logger.error(`API_ERROR: ${method} ${path}`, {
    error: error.message,
    stack: error.stack,
    ...details
  });
};

// Log startup
logger.info('='.repeat(80));
logger.info('Narrowcast Pro Server Starting');
logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
logger.info(`Log Level: ${logger.level}`);
logger.info(`Logs Directory: ${logsDir}`);
logger.info('='.repeat(80));

module.exports = logger;
