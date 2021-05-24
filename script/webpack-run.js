#!/usr/bin/env node
const process = require('process');
const { resolve } = require('path');
const { exec } = require('./helpers');

function build() {
  const path = resolve(__dirname, 'webpack.builder.config.js');

  exec('$(npm bin)/webpack', '--config', path).then(process.exit.bind(process));
}

build();
