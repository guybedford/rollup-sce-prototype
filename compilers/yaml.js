const { dataToNamedExports } = require('rollup-pluginutils');
const YAML = require('js-yaml');
const toSource = require('tosource');

module.exports = class {
  constructor (dataNamedExports) {
    this.dataNamedExports = dataNamedExports;
  }

  async transform (source, id) {
    const parsed = YAML.load(source);
    if (!this.dataNamedExports || typeof parsed !== 'object') {
      return `export default ${toSource(parsed)}`;
    }
    return dataToNamedExports(parsed);
  }
};