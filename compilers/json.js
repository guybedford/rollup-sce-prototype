const { dataToNamedExports } = require('../utils');

module.exports = class {
  constructor (dataNamedExports) {
    this.dataNamedExports = dataNamedExports;
  }

  async transform (source, id) {
    const parsed = JSON.parse(source);
    if (!this.dataNamedExports || typeof parsed !== 'object') {
      return `export default ${source}`;
    }
    return dataToNamedExports(parsed);
  }
};

module.exports.data = true;