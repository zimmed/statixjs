const buildAll = require('../build/bundle').default;
const { exec } = require('./helpers');

const path = resolve(__dirname, 'webpack.builder.config.js');

console.log('--- Building statixjs website ---');

exec(`$(npm bin)/webpack --config "${path}"`)
  .then(() =>
    buildAll(undefined, {
      prettyPrint: true,
      manifest: true,
      clean: true,
      pages: true,
      assets: true,
    })
  )
  .then(() => {
    console.log('--- Finished. ---');
    process.exit(0);
  })
  .catch((e) => {
    console.log(e?.stack);
    console.log(`--- Error: ${e?.message || e} ---`);
    process.exit(1);
  });
