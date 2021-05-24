#!/usr/bin/env node
const { exec: _exec } = require('./helpers');

let procs = 0;

module.exports = function exec(cli, waitForAll = false, restarts = 0, restartInterval = 1000) {
  procs += 1;
  _exec(cli).then((data) => {
    if (restarts > 0) {
      console.log(`Restarting ${first} in 1 second...`);
      setTimeout(() => exec(cli, restarts - 1, restartInterval), restartInterval);
    } else {
      if (waitForAll) procs -= 1;
      if (!waitForAll || !procs) process.exit(data);
    }
  });
};

function start(waitForAll = false) {
  _exec('$(npm-bin)/statix-compile').then(() => {
    exec('$(npm-bin)/statix-compile-watch', waitForAll);
    exec('$(npm bin)/statix-build-watch', waitForAll);
    exec('$(npm bin)/statix-serve', waitForAll);
  });
}

start();
