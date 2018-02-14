const path = require('path');

module.exports = function (config, env) {
  config.resolve = {
    alias: {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src')
    }
  };
  return config;
};
