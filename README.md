# @rollup/autocompile

Provides automatic compilatioin of standard compiler extensions for Rollup.

Includes support for `.css`, `.ts`, `.tsx` (based on `tsconfig.json`), `.jsx`, `.json`, `.toml` and `.yaml` files.

Babel compilation for `.js` files can be enabled optionally as well (following `.babelrc` config) with the `babel: true` configuration.

Compilations are pooled over worker threads for performance.

## Installation

```bash
npm install --save-dev @rollup/autocompile
```

## Usage

Example Rollup configuration with other plugins:

```js
// rollup.config.js
import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import autocompile from '@rollup/autocompile';

export default {
  input: './main.ts',
  plugins: [
    resolve({ extensions: ['.ts', '.json'] }),
    commonjs(),
    autocompile({
      // optional global include / exclude rules
      include: ['./src/*.ts'],
      exclude: ['node_modules/**'],

      // whether to create a source map
      // sourceMap: true,

      // whether to apply Babel to ".js" sources
      // babel: true,

      // whether to use css modules
      // cssModules: true,

      // whether to autoinstall needed compilers
      // autoInstall: false,

      // whether to load configuration files
      // configFiles: true,

      // custom configuration overrides for compilers
      // config: {
      //  [compilerName]: options
      // },
      
      // when importing data formats (json / yaml / toml), whether to provide named exports
      // dataNamedExports: true
    })
  ]
}
```

If different custom configurations are needed for different paths,
instantiating multiple versions of the plugin is supported and will share the same worker pool.