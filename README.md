# rollup-plugin-sce

Standard compiler extensions for Rollup.

Provides Rollup compilation of `.ts`, `.tsx` (based on `tsconfig.json`), `.jsx`, `.json` and `.yaml` files.

Babel compilation for `.js` files can be enabled optionally as well (following `.babelrc` config) with the `babel: true` configuration.

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
    rollupSce({
      // optional include / exclude rules
      include: ['./src/*.ts'],

      // whether to create a source map
      // sourceMap: true,

      // babel: true,
      
      // when importing data formats (json / yaml / csv), whether to provide named exports
      // dataNamedExports: true,

      // applies to Babel
      envTarget: {
        browsers: 'last 2 versions'
      }
    }),
    resolve({ extensions: ['.ts', '.json'] }),
    commonjs()
  ]
}
```

> Note it is important to put this plugin **first** to ensure correct precedence behaviours.