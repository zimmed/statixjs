#!/usr/bin/env node
const process = require('process');
const { resolve } = require('path');
const { getConfig, exec } = require('./helpers');

function serve() {
  const SITE = getConfig(true);
  const path = resolve(process.cwd(), SITE.buildOptions.websitePath);

  exec(
    `$(npm bin)/fast-live-reload -s ${path} -sp ${SITE.devServerOptions.port} -p ${
      SITE.devServerOptions.port + 1
    }`
  ).then(process.exit.bind(process));

  console.log(
    `\n-------------------------\nServing on localhost:${SITE.devServerOptions.port}\n-------------------------\n\n`
  );
}

serve();
