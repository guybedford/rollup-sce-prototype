const path = require('path');
const { createFilter } = require('rollup-pluginutils');
const workerFarm = require('worker-farm');

// TODO: .css (+modules), .less, .sass, .vue, .glsl
const compilerList = Object.create(null);
for (let ext of ['.js', '.jsx', '.json', '.ts', '.tsx', '.yaml'])
  compilerList[ext] = true;

module.exports = (options = {}) => {
  const babel = options.babel;
  const envTarget = options.envTarget;
  const filter = createFilter(options.include, options.exclude);

  let transformWorker;

  const tslibPath = require.resolve('tslib/tslib.es6.js');

  return {
    name: 'rollup-sce',
    resolveId (id, parent) {
      if (id === 'tslib' && (parent.endsWith('.ts') || parent.endsWith('.tsx')) && filter(id))
        return tslibPath;
    },
    transform (source, id) {
      transformWorker = transformWorker || workerFarm({
        maxConcurrentWorkers: require('os').cpus().length / 2,
        maxConcurrentCallsPerWorker: 1,
        autoStart: true
      }, require.resolve('./transform-worker'), ['transform']);

      if (!filter(id))
        return;
      
      const ext = path.extname(id);

      if (ext in compilerList === false)
        return;

      if (!babel && ext === '.js')
        return;

      return new Promise((resolve, reject) => {
        transformWorker.transform(source, id, options, (err, result) => err ? reject(err) : resolve(result));
      });
    },
    ongenerate () {
      if (transformWorker) {
        workerFarm.end(transformWorker);
        transformWorker = undefined;
      }
    },
  };
};