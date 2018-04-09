const fs = require('fs');
const stage3 = ['asyncGenerators', 'classProperties', 'optionalCatchBinding', 'objectRestSpread', 'numericSeparator'];
const stage3DynamicImport = stage3.concat(['dynamicImport', 'importMeta']);
const babel = require('@babel/core');

let babelPresetEnv;

class babel {
  constructor (options, sourceMap, envTarget) {
    if (envTarget && !babelPresetEnv)
      babelPresetEnv = require('@babel/preset-env');
    this.options = options;
    this.sourceMap = sourceMap;
    // lookup .babelrc here
  }

  async transform (source, id, callback) {
    try {
      return babel.transform(source, {
        babelrc: false,
        parserOpts: {
          plugins: stage3DynamicImport
        },
        ast: false,
        filename: id,
        parserOpts: {
          allowReturnOutsideFunction: true,
          plugins: stage3
        },
        sourceType: 'module',
        presets: envTarget && [[babelPresetEnv, {
          modules: false,
          // this assignment pending release of https://github.com/babel/babel/pull/7438
          targets: Object.assign({}, envTarget)
        }]]
      });
    }
    catch (err) {
      if (err.pos || err.loc)
        err.frame = err;
      throw err;
    }
  }
}