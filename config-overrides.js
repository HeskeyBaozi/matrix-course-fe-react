'use strict';

const tsImportPluginFactory = require('ts-import-plugin');
const { getLoader, compose } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const theme = require('./theme');

module.exports = compose(
  rewireTypescriptImport,
  rewireLess.withLoaderOptions({
    modifyVars: theme
  })
);

function rewireTypescriptImport(config, env) {
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
  return config;
}
