const process = require('process');
const { spawn } = require('child_process');

const quotePattern = /__QUOTE_(\d+)__/g;
const getQuote = (match, arr = []) => match && match[1] && arr[Number(match[1])];
const quoteReplace = (str = '', arr = []) => getQuote(str.match(quotePattern), arr) || str;

module.exports = function exec(cli) {
  const quotedItems = [];

  cli.replace(/(^|\s|=)(\".*[^\\]\"|\'.*[^\\]\')(\s|$)/, (m, x, _, z) => {
    const i = quotedItems.length;

    quotedItems.push(m);
    return `${x}__QUOTE_${i}__${z}`;
  });

  const [first, ...rest] = cli.split(' ');
  const child = spawn(
    quoteReplace(first, quotedItems),
    rest.map((e) => quoteReplace(e, quotedItems))
  );

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
