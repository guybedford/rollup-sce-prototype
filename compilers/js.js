const { transform: babelTransform } = require('@babel/core');
const { getConfig } = require('../utils');
const externalHelpers = require('@babel/plugin-external-helpers');
const stage3Syntax = ['asyncGenerators', 'classProperties', 'optionalCatchBinding', 'objectRestSpread', 'numericSeparator', 'dynamicImport', 'importMeta'];

let babelPresetEnv;

const helpersPath = require.resolve('../babel-helpers.js').replace(/\\/g, '/');

module.exports = class babel {
  constructor (options, sourceMap, envTarget) {
    if (envTarget && !babelPresetEnv)
      babelPresetEnv = require('@babel/preset-env');
    this.options = options;
    this.sourceMap = sourceMap;
    this.envTarget = envTarget;
  }

  getBabelOptions (id) {
    const options = getConfig(id, '.babelrc', this.options);
    options.babelrc = false;
    options.ast = false;
    options.filename = id;
    options.sourceType = 'module';
    options.parserOpts = { plugins: stage3Syntax };
    options.plugins = [externalHelpers, ...options.plugins || []];
    options.presets = this.envTarget ? [[babelPresetEnv, {
      modules: false,
      targets: this.envTarget
    }], ...options.presets || []] : options.presets;
    return options;
  }

  async transform (source, id) {
    try {
      let { code, map } = babelTransform(source, this.getBabelOptions(id));
      // no newline to avoid sourcemap complications
      if (code.indexOf('babelHelpers.') !== -1)
        code = `import * as babelHelpers from "${helpersPath}";${code}`;
      return { code, map };
    }
    catch (err) {
      if (err.pos || err.loc)
        err.frame = err;
      throw err;
    }
  }
}