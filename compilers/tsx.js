const tsbase = require('./ts.js');

module.exports = class typescript extends tsbase {
  constructor (options) {
    super(options);
    if (!this.compilerOptions.jsx)
      this.compilerOptions.jsx = 'react';
  }
};