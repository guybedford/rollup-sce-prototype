const json5 = require('json5');

// config file lookup utility
const fileCache = {};
exports.getConfig = function (filePath, configName, defaultConfig) {
  // json5.parse
  // recursive configuration lookup process
  return Object.assign({}, defaultConfig);
};

// convert data object into separate named exports (and default)
exports.dataToNamedExports = function (obj) {
  const { makeLegalIdentifier } = require('rollup-pluginutils');
  const tosource = require('tosource');

  let output = '';
  let defaultExports = '\n';
  const usedLegalKeys = Object.create(null);
  let index = 0;
  for (let key of Object.keys(obj)) {
    const legalKey = makeLegalIdentifier(key);
    output += `export const ${legalKey} = ${tosource(obj[key])};\n`;
    while (usedLegalKeys[legalKey + (index || '')])
      index++;
    index = 0;
    usedLegalKeys[legalKey + (index || '')] = true;
    if (defaultExports.length > 1)
      defaultExports += ',\n';
    defaultExports += `  ${key === legalKey ? key : `'${key}'`}: ${legalKey}`;
  }
  if (defaultExports.length > 3)
    defaultExports += '\n';
  output += `export default {${defaultExports}};`;
  return output;
};