#!/usr/bin/env node
const process = require('process');
const { resolve } = require('path');
const { exec } = require('./helpers');

function watch() {
  const path = resolve(__dirname, 'webpack.builder.config.js');

  exec(`$(npm bin)/.bin/webpack --config "${path}" --watch`).then(process.exit.bind(process));
}

watch();
