const process = require('process');
const { spawn } = require('child_process');

module.exports = function exec(...cli) {
  const child = spawn(...cli);

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
