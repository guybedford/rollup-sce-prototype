const rollup = require('rollup');
const autocompile = require('../rollup-autocompile');
const path = require('path');
const assert = require('assert');
const resolve = require('rollup-plugin-node-resolve');

const basePath = path.resolve('test/fixtures');

suite('Basic Usage', () => {
  test('typescript', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'typescript.ts'),
      plugins: [autocompile(), resolve({
        extensions: ['.ts']
      })]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    const exports = {};
    eval(code);
    assert.deepEqual(exports.transform('asdf'), { code: 'asdf' });
  });

  test('json', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'package.json'),
      plugins: [autocompile(), resolve({
        extensions: ['.json']
      })]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    const exports = {}
    eval(code);
    assert.equal(exports.name, 'custom-package');
  });

  test('json named', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'package.json'),
      plugins: [resolve({
        extensions: ['.json']
      }), autocompile({
        dataNamedExports: true
      })]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    const exports = {};
    eval(code);
    assert.equal(exports.name, 'custom-package');
  });

  test('toml', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'toml.toml'),
      plugins: [resolve({
        extensions: ['.toml']
      }), autocompile()]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    const exports = {};
    eval(code);
    assert.equal(exports.some.config, 'value');
  });

  test('yaml', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'yaml.yaml'),
      plugins: [resolve({
        extensions: ['.yaml']
      }), autocompile()]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    const expoorts = {};
    eval(code);
    assert.equal(exports.some, 'config');
  });

  test('tsx', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'typescript.tsx'),
      plugins: [resolve({
        extensions: ['.tsx']
      }), autocompile()]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    const exports = {};
    let el, text;
    const React = {
      createElement (_el, _blah, _text) {
        el = _el;
        text = _text;
      }
    };
    eval(code);
    exports.jsx();
    assert.deepEqual(exports.transform('asdf'), { code: 'asdf' });
    assert.equal(el, 'div');
    assert.equal(text, 'Hello');
  });

  test('babel', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'babel.js'),
      plugins: [autocompile()]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    const exports = {};
    eval(code);
    assert.equal(exports.a(), 5);
  });

  test('jsx', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'babel.jsx'),
      plugins: [autocompile()]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    const exports = {};
    let el, text;
    const React = {
      createElement (_el, _blah, _text) {
        el = _el;
        text = _text;
      }
    };
    eval(code);
    exports.jsx();
    assert.equal(el, 'div');
    assert.equal(text, 'Hello');
  });

  test('dynamic import', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'dynamic-import.js'),
      experimentalDynamicImport: true,
      plugins: [autocompile()]
    });
  
    let logValue;
    const { code, map } = await bundle.generate({ format: 'cjs' });
    {
      const console = {
        log (str) {
          logValue = str;
        }
      };
      eval(code);
    }
    await new Promise(resolve => process.nextTick(resolve));
    assert.equal(logValue, 'config');
  });
});

suite('typescript', () => {
  test('helpers', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'tshelper.ts'),
      plugins: [autocompile(), resolve({
        extensions: ['.ts']
      })]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    const exports = {};
    eval(code);
    assert.deepEqual(await exports.x([new Promise((resolve, reject) => resolve())]), 5);
  });

  test('inline config', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'tscustom.ts'),
      plugins: [resolve({
        extensions: ['.ts']
      }), autocompile({
        config: {
          typescript: {
            downlevelIteration: true
          }
        }
      })]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    assert.ok(code.indexOf('__values') !== -1);
  });

  test.skip('tsconfig', async () => {
    
  });
});

suite('babel', () => {
  test('helpers and inline config', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'babelhelper.js'),
      plugins: [autocompile({
        babel: true,
        config: {
          babel: {
            plugins: ['@babel/transform-async-to-generator']
          }
        }
      })]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    assert.ok(code.indexOf('asyncToGenerator') !== -1);
    const exports = {};
    eval(code);
    const val = await exports.p([new Promise(resolve => resolve())]);
    assert.equal(val, 5);
  });

  test.skip('babelrc', async () => {

  });
});

suite('syntax errors', () => {
  
});

suite('target env', () => {

});

suite('sourcemaps', () => {
  test.skip('typescript', async () => {

  });

  test.skip('babel', async () => {

  });
})