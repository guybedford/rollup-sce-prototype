const toml = require('toml');
const { dataToNamedExports } = require('rollup-pluginutils');
const toSource = require('tosource');

module.exports = class {
  constructor (dataNamedExports) {
    this.dataNamedExports = dataNamedExports;
  }

  async transform (source, id) {
    const parsed = toml.parse(source);
    if (!this.dataNamedExports || typeof parsed !== 'object') {
      return `export default ${toSource(parsed)}`;
    }
    return dataToNamedExports(parsed);
  }
};