// Define __DEV__ if it's not already defined
const __DEV__ = process.env.NODE_ENV === 'development';

// Your logger setup
const logger = {
  log: __DEV__ ? console.log : () => {},
};

export default logger;