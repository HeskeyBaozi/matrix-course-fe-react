'use strict';

const { compose } = require('react-app-rewired');
const rewireLess = require('./configs/less-modules');
const rewireTypescriptImport = require('./configs/ts-import');
const theme = require('./configs/theme');

module.exports = compose(
  rewireTypescriptImport,
  rewireLess.withLoaderOptions(
    '[local]___[hash:base64:5]',
    {
      modifyVars: theme
    })
);
