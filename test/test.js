const rollup = require('rollup');
const rollupSce = require('../rollup-sce');
const path = require('path');
const assert = require('assert');
const resolve = require('rollup-plugin-node-resolve');

const basePath = path.resolve('test/fixtures');

suite('Basic Usage', () => {
  test('typescript', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'typescript.ts'),
      plugins: [rollupSce(), resolve({
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
      plugins: [rollupSce(), resolve({
        extensions: ['.json']
      })]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    const module = { exports: undefined };
    eval(code);
    assert.equal(module.exports.name, 'custom-package');
  });

  test('json named', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'package.json'),
      plugins: [rollupSce({
        dataNamedExports: true
      }), resolve({
        extensions: ['.json']
      })]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    const exports = {};
    eval(code);
    assert.equal(exports.name, 'custom-package');
  });

  test('yaml', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'yaml.yaml'),
      plugins: [rollupSce(), resolve({
        extensions: ['.yaml']
      })]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    const module = { exports: undefined };
    eval(code);
    assert.equal(module.exports.some, 'config');
  });

  test('tsx', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'typescript.tsx'),
      plugins: [rollupSce(), resolve({
        extensions: ['.tsx']
      })]
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

  test.skip('babel', async () => {

  });

  test.skip('jsx', async () => {

  });

  test.skip('dynamic import', async () => {

  });
});

suite('typescript', () => {
  test('helpers', async () => {
    const bundle = await rollup.rollup({
      input: path.resolve(basePath, 'tshelper.ts'),
      plugins: [rollupSce(), resolve({
        extensions: ['.ts']
      })]
    });
  
    const { code, map } = await bundle.generate({ format: 'cjs' });
    const exports = {};
    eval(code);
    assert.deepEqual(await exports.x([new Promise((resolve, reject) => resolve())]), 5);
  });

  test.skip('compiler config', async () => {

  });

  test.skip('jsx config', async () => {

  });
});

suite('sourcemaps', () => {
  test.skip('typescript', async () => {

  });

  test.skip('babel', async () => {

  });
})