const { dataToNamedExports } = require('rollup-pluginutils');

module.exports = class {
  constructor (options) {
    this.dataNamedExports = options.dataNamedExports;
  }

  async transform (source, id) {
    const parsed = JSON.parse(source);
    if (!this.dataNamedExports || typeof parsed !== 'object') {
      return `export default ${source}`;
    }
    return dataToNamedExports(parsed);
  }
};