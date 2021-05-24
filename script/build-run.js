const buildAll = require('../build/bundle').default;

console.log('--- Building statixjs website ---');
buildAll(console.log.bind(console))
  .then(() => {
    console.log('--- Finished. ---');
    process.exit(0);
  })
  .catch((e) => {
    console.log(e?.stack);
    console.log(`--- Error: ${e?.message || e} ---`);
    process.exit(1);
  });
