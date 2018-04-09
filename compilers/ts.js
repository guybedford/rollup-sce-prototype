const ts = require('typescript');
const { getConfig } = require('../utils');

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
    return { code: result.outputText, map: result.sourceMapText };
  }
};