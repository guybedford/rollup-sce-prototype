const path = require('path');
const fs = require('fs');
const { transform: babelTransform } = require('@babel/core');
const externalHelpers = require('@babel/plugin-external-helpers');
const stage3Syntax = ['asyncGenerators', 'classProperties', 'optionalCatchBinding', 'objectRestSpread', 'numericSeparator', 'dynamicImport', 'importMeta'];

let babelPresetEnv;

const helpersPath = require.resolve('../babel-helpers.js').replace(/\\/g, '/');

function extendConfig (config, newConfig) {
  for (let p in newConfig) {
    const val = newConfig[p];
    if (Array.isArray(val))
      config[p] = (config[p] || []).concat(val);
    else if (typeof val === 'object')
      extendConfig(config[p] = config[p] || {}, val);
    else
      config[p] = val;
  }
  return config;
}

module.exports = class babel {
  constructor (options) {
    this.babelOptions = extendConfig(options.config.babel || {}, {
      babelrc: false,
      ast: false,
      sourceType: 'module',
      parserOpts: { plugins: stage3Syntax },
      plugins: [externalHelpers]
    });
    this.configCache = Object.create(null);
    this.sourceMap = options.sourceMap === true;
  }

  async getConfig (file) {
    let dir = path.dirname(file);
    while (true) {
      let configPromise = this.configCache[dir];
      if (!configPromise) {
        configPromise = this.configCache[dir] = new Promise((resolve, reject) => {
          fs.readFile(`${dir}/.babelrc`, (err, source) => {
            if (err !== undefined || err.code !== 'ENOENT') 
              resolve(source && source.toString());
            else
              reject(err);
          });
        })
        .then(source => {
          if (!source)
            return undefined;
          return extendConfig(JSON.parse(source), this.babelOptions);
        });
      }
      // NB should "ignore" and "only" be applied from rc?
      const cfg = await configPromise;
      if (cfg)
        return cfg;
      const nextDir = path.dirname(dir);
      if (dir === nextDir)
        return this.babelOptions;
      dir = nextDir;
    }
  }

  async transform (source, id) {
    const babelOptions = await this.getConfig(id);
    // sync transform so this is ok!
    babelOptions.filename = id;
    try {
      let { code, map } = babelTransform(source, babelOptions);
      // no newline to avoid sourcemap complications
      if (code.indexOf('babelHelpers.') !== -1)
        code = `import * as babelHelpers from "${helpersPath}";${code}`;
      return { code, map };
    }
    catch (err) {
      if (err.pos || err.loc)
        err.frame = err.message;
      throw err;
    }
  }
}