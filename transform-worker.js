const path = require('path');

const compilerInstances = Object.create(null);
const compilerOptions = JSON.parse(process.env.AUTOCOMPILE_OPTIONS);

function getCompiler (ext) {
  let compilerInstance = compilerInstances[ext];
  if (compilerInstance)
    return compilerInstance;
  
  // (-> @rollup/autocompile-[ext])
  const compilerConstructor = require('./compilers/' + ext.substr(1) + '.js');
  compilerInstance = new compilerConstructor(compilerOptions);
  compilerInstances[ext] = compilerInstance;
  return compilerInstance;
}

exports.transform = function (source, id, callback) {
  Promise.resolve()
  .then(() => getCompiler(path.extname(id)).transform(source, id))
  .then(result => callback(null, result), callback);
};