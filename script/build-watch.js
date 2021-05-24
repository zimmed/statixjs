#!/usr/bin/env node
const fs = require('fs-extra');
const { resolve } = require('path');
const watch = require('glob-watcher');
let mod = require('../build/bundle');

function reloadCompile() {
  const path = '../build/compile';

  try {
    delete require.cache[require.resolve(path)];
    mod = require(path);
  } catch (e) {
    console.warn('WARNING: No build/compile.js bundle available.');
    mod = null;
  }
}

function configureBuild(reload = false, opts = {}) {
  return () => {
    if (reload) reloadCompile();
    console.log('building...', JSON.stringify(opts));
    const error = mod?.default(undefined, opts);

    if (error) {
      console.warn(error?.stack);
      console.warn(error?.message || error);
    }
  };
}

function debounce(fn, time = 100) {
  let handler = null;

  return (...args) => {
    if (handler) {
      clearTimeout(handler);
    }

    handler = setTimeout(() => {
      handler = null;
      fn(...args);
    }, time);
  };
}

configureBuild(true, {
  clean: true,
  prettyPrint: true,
  pages: true,
  assets: true,
  manifest: true,
})();

fs.watchFile(
  resolve(process.cwd(), 'build', 'bundle.js'),
  { interval: 200 },
  debounce(
    configureBuild(true, {
      manifest: false,
      clean: false,
      pages: true,
      assets: false,
      prettyPrint: true,
    })
  )
);

fs.watchFile(
  resolve(process.cwd(), 'siteconfig.json'),
  { interval: 200 },
  debounce(
    configureBuild(true, {
      manifest: true,
      clean: false,
      pages: true,
      assets: false,
      prettyPrint: true,
    })
  )
);

const watcher = watch(resolve(process.cwd(), 'public', '**/*'));

watcher.on(
  'change',
  configureBuild(false, {
    pages: false,
    manifest: false,
    clean: false,
    prettyPrint: true,
    assets: true,
  })
);
watcher.on(
  'add',
  configureBuild(false, {
    pages: false,
    manifest: false,
    clean: false,
    prettyPrint: true,
    assets: true,
  })
);
watcher.on(
  'unlink',
  configureBuild(false, {
    pages: true,
    manifest: true,
    clean: true,
    prettyPrint: true,
    assets: true,
  })
);
