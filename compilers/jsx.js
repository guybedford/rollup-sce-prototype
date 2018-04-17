const babelbase = require('./js.js');
const reactPreset = require('@babel/preset-react');

module.exports = class babel extends babelbase {
  constructor (options) {
    super(options);
    if (this.babelOptions.presets)
      this.babelOptions.presets.unshift(reactPreset);
    else
      this.babelOptions.presets = [reactPreset];
  }
};