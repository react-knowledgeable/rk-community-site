/* This is for building the Netlify functions (lambdas) only! */

const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
const readdir = promisify(fs.readdir)
const replace = require('@rollup/plugin-replace')

export default () => {
  return new Promise(res => {
    _getFunctionPaths().then(paths => {
      res(
        paths.map(func => ({
          input: func.input,
          output: {
            file: path.resolve(__dirname, '../../functions', func.filePath),
            format: 'cjs',
          },
          plugins: [
            replace({
              __AIRTABLE_API_KEY__: process.env.AIRTABLE_API_KEY,
              __AIRTABLE_BASE_ID__: process.env.AIRTABLE_BASE_ID,
              __RK_RSVP_CLIENT_ID__: process.env.RK_RSVP_CLIENT_ID,
              __RK_RSVP_CLIENT_SECRET__: process.env.RK_RSVP_CLIENT_SECRET,
            }),
          ],
          external: ['airtable'],
        }))
      )
    })
  })
}

async function _getFunctionPaths() {
  const functionSrc = path.resolve(__dirname)
  const functionPaths = await readdir(functionSrc)
  return functionPaths
    .filter(filePath => {
      return ![
        'node_modules',
        'package.json',
        'yarn.lock',
        'rollup.config.js',
      ].includes(filePath)
    })
    .map(filePath => ({
      input: path.resolve(functionSrc, filePath),
      filePath,
    }))
}
