// This is for building the Netlify functions (lambdas) only!

const commonjs = require('rollup-plugin-commonjs');
const fs = require('fs');
const json = require('rollup-plugin-json');
const path = require('path');
const promisify = require('util').promisify;
const readdir = promisify(fs.readdir);
const resolve = require('rollup-plugin-node-resolve');

export default () => {
  return new Promise(res => {
    _getFunctionPaths().then(paths => {
      res(
        paths.map(func => ({
          input: func.input,
          output: {
            file: path.resolve(__dirname, 'functions', func.filePath),
            format: 'cjs',
          },
          plugins: [resolve(), commonjs(), json()],
        }))
      );
    });
  });
};

async function _getFunctionPaths() {
  const functionSrc = path.resolve(__dirname, 'src/functions');
  const functionPaths = await readdir(functionSrc);
  return functionPaths.map(filePath => ({
    input: path.resolve(functionSrc, filePath),
    filePath,
  }));
}
