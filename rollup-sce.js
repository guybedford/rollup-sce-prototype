const path = require('path');
const { createFilter } = require('rollup-pluginutils');
const workerFarm = require('worker-farm');

module.exports = (options = {}) => {
  const babel = options.babel || options.envTarget;
  const envTarget = options.envTarget;

  // TODO: .css (+modules), .less, .sass, .vue, .glsl, .pug, .handlebars
  const filter = createFilter(options.include || '**.(js|jsx|json|toml|ts|tsx|yaml)', options.exclude);

  let transformWorker;

  return {
    name: 'rollup-sce',
    transform (source, id) {
      transformWorker = transformWorker || workerFarm({
        maxConcurrentWorkers: require('os').cpus().length / 2,
        maxConcurrentCallsPerWorker: 1,
        autoStart: true
      }, require.resolve('./transform-worker'), ['transform']);

      if (!filter(id))
        return;
      
      const ext = path.extname(id);
      if (!ext)
        return;

      if (!babel && ext === '.js')
        return;

      // TODO: maintain an internal cache?
      // requires knowledge of external dependencies
      // ideally Rollup can do this internally!

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