const ts = require('typescript');
const path = require('path');
const fs = require('fs');
if (ts.version.split('.')[0] !== '2')
  throw new Error('Invalid TypeScript version, expected TypeScript version 2.');
const tslibPath = require.resolve('tslib/tslib.es6.js').replace(/\\/g, '/');

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
}

module.exports = class typescript {
  constructor (options) {
    this.compilerOptions = Object.assign(options.config.typescript || {}, {
      noEmit: false,
      module: ts.ModuleKind.ES2015,
      noEmitHelpers: true,
      emitDeclarationOnly: false,
      importHelpers: true,
      sourceMap: this.sourceMap
    });
    this.configCache = Object.create(null);
    this.sourceMap = options.sourceMap;
  }

  async getConfig (file) {
    let dir = path.dirname(file);
    while (true) {
      let configPromise = this.configCache[dir];
      if (!configPromise) {
        configPromise = this.configCache[dir] = new Promise((resolve, reject) => {
          fs.readFile(`${dir}/tsconfig.json`, (err, source) => {
            if (err !== undefined || err.code !== 'ENOENT') 
              resolve(source && source.toString());
            else
              reject(err);
          });
        })
        // TODO: support "extends" in tsconfig.json
        // apply default and enforced configuration options
        .then(source => {
          if (!source)
            return undefined;
          return extendConfig(JSON.parse(source), this.compilerOptions);
        });
      }
      // NB should we skip configurations that don't apply through their files, include and exclude?
      const cfg = await configPromise;
      if (cfg)
        return cfg;
      const nextDir = path.dirname(dir);
      if (dir === nextDir)
        return this.compilerOptions;
      dir = nextDir;
    }
  }

  async transform (source, id, callback) {
    const result = ts.transpileModule(source, {
      compilerOptions: await this.getConfig(id),
      fileName: id,
      reportDiagnostics: false
    });
    // substitute path to helpers
    // wont affect sourcemap as a first-line column offset change only
    const tslibMatch = result.outputText.match(/^import \* as tslib_(\d+) from "tslib";/);
    if (tslibMatch) {
      result.outputText = `import * as tslib_${tslibMatch[1]} from "${tslibPath}";${result.outputText.substr(32 + tslibMatch[1].length)}`;
    }
    return { code: result.outputText, map: result.sourceMapText };
  }
};