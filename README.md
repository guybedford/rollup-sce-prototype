# rollup-plugin-sce

Standard compiler extensions for Rollup.

Provides Rollup compilation of `.css`, `.ts`, `.tsx` (based on `tsconfig.json`), `.jsx`, `.json`, `.toml` and `.yaml` files.

Babel compilation for `.js` files can be enabled optionally as well (following `.babelrc` config) with the `babel: true` configuration.

Compilations are pooled over worker threads for performance.

## Installation

```bash
npm install --save-dev rollup-plugin-sce
```

## Usage

Example Rollup configuration with other plugins:

```js
// rollup.config.js
import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import rollupSce from 'rollup-plugin-sce';

export default {
  input: './main.ts',
  plugins: [
    resolve({ extensions: ['.ts', '.json'] }),
    commonjs(),
    rollupSce({
      // optional global include / exclude rules
      include: ['./src/*.ts'],
      exclude: ['node_modules/**'],

      // whether to create a source map
      // sourceMap: true,

      // whether to apply Babel to ".js" sources
      // babel: true,

      // whether to use css modules
      // cssmodules: true,

      // custom compiler options objects
      // babelOptions: { plugins: ['custom-plugin'] }
      // typescriptOptions
      // postcssOptions
      
      // when importing data formats (json / yaml / toml), whether to provide named exports
      // dataNamedExports: true,

      // applies to Babel, PostCSS and TypeScript conversions
      // enables babel compilation when set
      envTarget: {
        browsers: 'last 2 versions'
      }
    })
  ]
}
```

If different custom configurations are needed for different paths,
instantiating multiple versions of the plugin is supported and will share the same worker pool.