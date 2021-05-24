const process = require('process');
const { spawn } = require('child_process');
const { resolve } = require('path');

module.exports = function exec(first, ...rest) {
  const binPath = resolve(process.cwd(), 'node_modules', '.bin');
  const child = spawn(first.replace(/\$\(npm bin\)/gi, binPath), rest);

  child.stdout.on('data', function (data) {
    process.stdout.write(data);
  });
  child.stderr.on('data', function (data) {
    process.stderr.write(data);
  });
  return new Promise((res) => {
    child.on('exit', res);
  });
};
