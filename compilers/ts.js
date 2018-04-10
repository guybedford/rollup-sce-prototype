const ts = require('typescript');
if (ts.version.split('.')[0] !== '2')
  throw new Error('Invalid TypeScript version, expected TypeScript version 2.');
const { getConfig } = require('../utils');
const tslibPath = require.resolve('tslib/tslib.es6.js').replace(/\\/g, '/');

module.exports = class typescript {
  constructor (compilerOptions, sourceMap, envTarget) {
    this.compilerOptions = compilerOptions || {};
    this.sourceMap = sourceMap;
    // convert envTarget into the closest compilerOptions target and options
  }

  getCompilerOptions (id) {
    const compilerOptions = getConfig(id, 'tsconfig.json', this.compilerOptions);
    compilerOptions.noEmit = false;
    compilerOptions.module = ts.ModuleKind.ES2015;
    compilerOptions.noEmitHelpers = true;
    compilerOptions.emitDeclarationOnly = false;
    compilerOptions.importHelpers = true;
    compilerOptions.sourceMap = this.sourceMap;
    return compilerOptions;
  }

  async transform (source, id, callback) {
    const compilerOptions = this.getCompilerOptions(id);
    const result = ts.transpileModule(source, {
      compilerOptions: compilerOptions,
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