/**
 * Simple structured logger with timestamp and level prefix.
 */

const LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

function getTimestamp() {
  return new Date().toISOString();
}

function formatMessage(level, ...args) {
  const timestamp = getTimestamp();
  const message = args
    .map((arg) => {
      if (arg instanceof Error) {
        return `${arg.message}\n${arg.stack}`;
      }
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(' ');

  return `[${timestamp}] [${level}] ${message}`;
}

const logger = {
  debug(...args) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatMessage(LEVELS.DEBUG, ...args));
    }
  },

  info(...args) {
    console.log(formatMessage(LEVELS.INFO, ...args));
  },

  warn(...args) {
    console.warn(formatMessage(LEVELS.WARN, ...args));
  },

  error(...args) {
    console.error(formatMessage(LEVELS.ERROR, ...args));
  },
};

export default logger;
