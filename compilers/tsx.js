const tsbase = require('./ts.js');

module.exports = class typescript extends tsbase {
  getCompilerOptions (id) {
    const compilerOptions = super.getCompilerOptions(id);
    if (compilerOptions.jsx !== 'preserve')
      compilerOptions.jsx = 'react';
    return compilerOptions;
  }
};