'use strict';

const tsImportPluginFactory = require('ts-import-plugin');
const { getLoader } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const theme = require('./theme');

module.exports = function (config, env) {
  console.log('[Current Env] ', env);

  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.includes('ts-loader')
  );

  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [
        tsImportPluginFactory({
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true,
        })
      ]
    })
  };

  config = rewireLess.withLoaderOptions({
    modifyVars: theme,
  })(config, env);

  return config;
};
