const path = require('path');
const compilerInstances = Object.create(null);

function getCompiler (ext, options) {
  let compilerInstance = compilerInstances[ext];
  if (compilerInstance)
    return compilerInstance;
  
  const compilerConstructor = require('./compilers/' + ext.substr(1) + '.js');
  if (compilerConstructor.data)
    compilerInstance = new compilerConstructor(options.dataNamedExports, options.sourceMap === true);
  else
    compilerInstance = new compilerConstructor(options[compilerConstructor.name], options.sourceMap === true, options.envTarget);
  compilerInstances[ext] = compilerInstance;
  return compilerInstance;
}

exports.transform = function (source, id, options, callback) {
  Promise.resolve()
  .then(() => getCompiler(path.extname(id), options).transform(source, id))
  .then(result => callback(null, result), callback);
};