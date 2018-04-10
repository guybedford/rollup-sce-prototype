const babelbase = require('./js.js');
const reactPreset = require('@babel/preset-react');

module.exports = class babel extends babelbase {
  getBabelOptions (id) {
    const options = super.getBabelOptions(id);
    if (options.presets)
      options.presets.unshift(reactPreset);
    else
      options.presets = [reactPreset];
    return options;
  }
};