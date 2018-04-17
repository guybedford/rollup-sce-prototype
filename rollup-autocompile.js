const path = require('path');
const { createFilter } = require('rollup-pluginutils');
const workerFarm = require('worker-farm');

module.exports = (opts = {}) => {
  const options = {
    include: opts.include,
    exclude: opts.exclude,
    sourceMap: 'sourceMap' in opts ? opts.sourceMap : false,
    babel: 'babel' in opts ? opts.babel : false,
    cssModules: 'cssModules' in opts ? opts.cssModules: false,
    autoInstall: opts.autoInstall !== false,
    configFiles: opts.configFiles !== false,
    config: opts.config || {},
    dataNamedExports: opts.dataNamedExports !== false
  };

  const filter = createFilter(options.include, options.exclude);

  let transformWorker;
  return {
    name: 'rollup-autocompile',
    onbuildstart () {
      transformWorker = workerFarm({
        workerOptions: {
          env: { AUTOCOMPILE_OPTIONS: JSON.stringify(options) }
        },
        maxConcurrentWorkers: require('os').cpus().length / 2,
        maxConcurrentCallsPerWorker: 1,
        autoStart: true
      }, require.resolve('./transform-worker'), ['transform']);
    },
    onbuildend () {
      workerFarm.end(transformWorker);
      transformWorker = undefined;
    },
    transform (source, id) {
      if (!filter(id))
        return;
      
      const ext = path.extname(id);
      if (!ext)
        return;

      if (!options.babel && ext === '.js')
        return;

      // TODO: maintain an internal cache?
      // requires knowledge of external dependencies
      // ideally Rollup can do this internally!

      return new Promise((resolve, reject) => 
        transformWorker.transform(source, id, (err, result) => err ? reject(err) : resolve(result))
      );
    }
  };
};